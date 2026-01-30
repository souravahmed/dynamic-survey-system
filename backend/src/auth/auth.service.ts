/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { UserRole } from '@/common/enums/user-role.enum';
import { RegisterDto } from '@/user/dto/register.dto';
import { UserService } from '@/user/user.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { SigninDto } from './dto/SigninDto';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<any> {
    try {
      const user = await this.userService.register(registerDto);

      const { email, role } = user;

      const accessToken = this.generateAccessToken(email, role);
      const refreshToken = this.generateRefreshToken(email, role);

      return { ...user, accessToken, refreshToken };
    } catch (error) {
      this.logger.error('AuthService.register', error);
      throw error;
    }
  }

  async signin(signinDto: SigninDto): Promise<any> {
    try {
      const user = await this.userService.getUserByEmail(signinDto.email);

      await this.comparePassword(signinDto.password, user.password);

      const { email, role } = user;

      const accessToken = this.generateAccessToken(email, role);
      const refreshToken = this.generateRefreshToken(email, role);

      return { ...user, accessToken, refreshToken };
    } catch (error) {
      this.logger.error('AuthService.signin', error);

      throw error;
    }
  }

  private async comparePassword(
    givenPassword: string,
    existPasswordHash: string,
  ): Promise<void> {
    const isAuthenticated = await compare(givenPassword, existPasswordHash);

    if (!isAuthenticated) {
      throw new BadRequestException(
        'Authentication failed. Invalid  password.',
      );
    }
  }

  private generateAccessToken(email: string, role: UserRole): string {
    return this.jwtService.sign({ email, role } as JwtPayload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>(
        'ACCESS_TOKEN_EXPIRATION',
      ) as any,
    });
  }

  private generateRefreshToken(email: string, role: UserRole): string {
    return this.jwtService.sign({ email, role } as JwtPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>(
        'REFRESH_TOKEN_EXPIRATION',
      ) as any,
    });
  }
}
