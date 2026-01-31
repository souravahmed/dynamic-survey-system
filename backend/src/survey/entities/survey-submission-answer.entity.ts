import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { SurveyFieldEntity } from './survey-field.entity';
import { SurveySubmissionEntity } from './survey-submission.entity';

@Entity('survey_submission_answers')
export class SurveySubmissionAnswerEntity extends BaseEntity {
  @ManyToOne(() => SurveySubmissionEntity, (submission) => submission.answers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'submissionId' })
  submission: SurveySubmissionEntity;

  @Column()
  submissionId: string;

  @ManyToOne(() => SurveyFieldEntity)
  @JoinColumn({ name: 'fieldId' })
  field: SurveyFieldEntity;

  @Column()
  fieldId: string;

  @Column({ type: 'text' })
  value: string; // Store as JSON string for multiple values
}
