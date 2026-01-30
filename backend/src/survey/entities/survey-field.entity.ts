import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SurveyEntity } from './survey.entity';
import { BaseEntity } from '@/common/entities/base.entity';
import { FieldType } from '@/common/enums/field-type.enum';

@Entity('survey_fields')
export class SurveyFieldEntity extends BaseEntity {
  @Column()
  label: string;

  @Column({
    type: 'simple-enum',
    enum: FieldType,
  })
  fieldType: FieldType;

  @Column({ default: false })
  isRequired: boolean;

  @Column({ type: 'simple-json', nullable: true })
  options: string[];

  @ManyToOne(() => SurveyEntity, (survey) => survey.fields, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'surveyId' })
  survey: SurveyEntity;

  @Column()
  surveyId: string;
}
