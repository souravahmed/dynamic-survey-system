import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { UserRole } from '@/common/enums/user-role.enums';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({
    type: 'simple-enum',
    enum: UserRole,
    default: UserRole.OFFICER,
  })
  role: UserRole;
}
