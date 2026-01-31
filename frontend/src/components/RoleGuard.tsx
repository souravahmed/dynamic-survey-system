import { ReactNode } from "react";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/enums/userRole";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

export const RoleGuard = ({
  children,
  allowedRoles,
  fallback = null,
}: RoleGuardProps) => {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
