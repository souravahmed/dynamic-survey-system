import { UserRole } from "@/enums/userRole";
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  BarChart3,
  LucideIcon,
} from "lucide-react";
import { RoutePath } from "./routePath";

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

export const MENU_ITEMS: Record<string, MenuItem[]> = {
  [UserRole.ADMIN]: [
    {
      icon: LayoutDashboard,
      label: "Overview",
      path: RoutePath.DASHBOARD,
    },
    {
      icon: PlusCircle,
      label: "Create Survey",
      path: RoutePath.NEW_SURVEY,
    },
    {
      icon: BarChart3,
      label: "Submissions",
      path: "/submissions",
    },
  ],

  [UserRole.OFFICER]: [
    {
      icon: LayoutDashboard,
      label: "Available Surveys",
      path: RoutePath.DASHBOARD,
    },
  ],
};

export const getMenuItems = (role: UserRole): MenuItem[] => {
  return MENU_ITEMS[role] || MENU_ITEMS[UserRole.OFFICER];
};
