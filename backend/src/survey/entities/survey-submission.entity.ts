import { BaseEntity } from '@/common/entities/base.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { SurveyEntity } from './survey.entity';
import { UserEntity } from '@/user/entities/user.entity';
import { SurveySubmissionAnswerEntity } from './survey-submission-answer.entity';

@Entity('survey_submissions')
export class SurveySubmissionEntity extends BaseEntity {
  @ManyToOne(() => SurveyEntity, (survey) => survey.submissions)
  @JoinColumn({ name: 'surveyId' })
  survey: SurveyEntity;

  @Column()
  surveyId: string;

  @ManyToOne(() => UserEntity, (user) => user.submissions)
  @JoinColumn({ name: 'submittedById' })
  submittedBy: UserEntity;

  @Column()
  submittedById: string;

  @CreateDateColumn()
  submittedAt: Date;

  @OneToMany(
    () => SurveySubmissionAnswerEntity,
    (answer) => answer.submission,
    {
      cascade: true,
    },
  )
  answers: SurveySubmissionAnswerEntity[];
}
