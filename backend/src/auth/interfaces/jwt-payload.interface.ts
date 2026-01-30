import { UserRole } from '@/common/enums/user-role.enum';

export interface JwtPayload {
  email: string;
  role: UserRole;
}
