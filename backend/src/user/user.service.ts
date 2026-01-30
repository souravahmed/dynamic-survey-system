import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { UserEntity } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserEntity> {
    try {
      await this.isUserExistByEmail(registerDto.email);

      const hashedPassword: string = await bcrypt.hash(
        registerDto.password,
        10,
      );

      const user = this.userRepository.create({
        ...registerDto,
        password: hashedPassword,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      this.logger.error('UserService.register', error);
      throw error;
    }
  }

  private async isUserExistByEmail(email: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
  }
}
