import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health.controller';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { SurveyModule } from './survey/survey.module';
import { SurveyFieldEntity } from './survey/entities/survey-field.entity';
import { SurveyEntity } from './survey/entities/survey.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommonModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/database.sqlite',
      entities: [UserEntity, SurveyEntity, SurveyFieldEntity],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    SurveyModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
