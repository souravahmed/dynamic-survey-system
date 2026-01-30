import { BaseEntity } from '@/common/entities/base.entity';
import { UserEntity } from '@/user/entities/user.entity';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { SurveyFieldEntity } from './survey-field.entity';

@Entity('surveys')
export class SurveyEntity extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => UserEntity, (user) => user.surveys)
  @JoinColumn({ name: 'createdById' })
  createdBy: UserEntity;

  @Column()
  createdById: string;

  @OneToMany(() => SurveyFieldEntity, (field) => field.survey, {
    cascade: true,
  })
  fields: SurveyFieldEntity[];
}
