import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyEntity } from './entities/survey.entity';
import { SurveyFieldEntity } from './entities/survey-field.entity';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { UserModule } from '@/user/user.module';
import { SurveySubmissionAnswerEntity } from './entities/survey-submission-answer.entity';
import { SurveySubmissionEntity } from './entities/survey-submission.entity';
import { SurveySubmissionController } from './survey-submission.controller';
import { SurveySubmissionService } from './survey-submission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SurveyEntity,
      SurveyFieldEntity,
      SurveySubmissionEntity,
      SurveySubmissionAnswerEntity,
    ]),
    UserModule,
  ],
  providers: [SurveyService, SurveySubmissionService],
  controllers: [SurveyController, SurveySubmissionController],
})
export class SurveyModule {}
