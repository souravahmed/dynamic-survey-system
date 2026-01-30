import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { UserRole } from '@/common/enums/user-role.enum';
import { SurveyEntity } from '@/survey/entities/survey.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  name: string;

  @Column({
    type: 'simple-enum',
    enum: UserRole,
    default: UserRole.OFFICER,
  })
  role: UserRole;

  @OneToMany(() => SurveyEntity, (survey) => survey.createdBy)
  surveys: SurveyEntity[];
}
