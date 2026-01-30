import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyEntity } from './entities/survey.entity';
import { SurveyFieldEntity } from './entities/survey-field.entity';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SurveyEntity, SurveyFieldEntity]),
    UserModule,
  ],
  providers: [SurveyService],
  controllers: [SurveyController],
})
export class SurveyModule {}
