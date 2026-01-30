import { FileText, Users, CheckCircle, Clock } from "lucide-react";

export const DASHBOARD_STATS = [
  {
    label: "Active Surveys",
    value: "12",
    icon: FileText,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Total Officers",
    value: "48",
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    label: "Submissions Today",
    value: "156",
    icon: CheckCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Avg. Completion Time",
    value: "4m",
    icon: Clock,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];
