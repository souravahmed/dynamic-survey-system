import { UserRole } from '@/common/enums/user-role.enums';
import { RegisterDto } from '@/user/dto/register.dto';
import { UserService } from '@/user/user.service';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

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

      const { password: _, ...rest } = user;

      return { ...rest, accessToken, refreshToken };
    } catch (error) {
      this.logger.error('AuthService.register', error);
      throw error;
    }
  }

  private generateAccessToken(email: string, role: UserRole): string {
    const expiresIn = this.configService.get<string>('ACCESS_TOKEN_EXPIRATION');

    return this.jwtService.sign({ email, role } as JwtPayload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: Number.parseInt(expiresIn),
    });
  }

  private generateRefreshToken(email: string, role: UserRole): string {
    const expiresIn = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRATION',
    );

    return this.jwtService.sign({ email, role } as JwtPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: Number.parseInt(expiresIn),
    });
  }
}
