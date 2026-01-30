import { UserRole } from '@/common/enums/user-role.enums';

export interface JwtPayload {
  email: string;
  role: UserRole;
}
