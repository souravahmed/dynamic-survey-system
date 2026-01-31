import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/enums/userRole";
import { useSurvey } from "@/hooks/useSurvey";
import {
  Calendar,
  Users,
  ArrowRight,
  ClipboardList,
  CheckCircle,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { RoutePath } from "@/constants/routePath";
import { Survey } from "@/interfaces";
import { RoleGuard } from "@/components/RoleGuard";

export const DashboardPage = () => {
  const { user } = useAuthStore();

  const { surveys, isLoadingList } = useSurvey();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {user?.name || "User"}!
        </h1>
        <p className="text-slate-500">
          Here's what's happening with your surveys today.
        </p>
      </div>

      <StatsGrid />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">Recent Surveys</h2>
        <RoleGuard allowedRoles={[UserRole.ADMIN]}>
          <Link
            to={RoutePath.NEW_SURVEY}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Create New <ArrowRight size={16} />
          </Link>
        </RoleGuard>
      </div>

      {isLoadingList ? (
        <SurveyLoader />
      ) : surveys?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys.map((survey) => (
            <SurveyCard key={survey.id} survey={survey} />
          ))}
        </div>
      ) : (
        <EmptyList />
      )}
    </div>
  );
};

const SurveyLoader = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-3xl border border-slate-100 animate-pulse"
        >
          <div className="h-6 bg-slate-100 rounded w-3/4 mb-4" />
          <div className="h-4 bg-slate-50 rounded w-full mb-2" />
          <div className="h-4 bg-slate-50 rounded w-5/6" />
        </div>
      ))}
    </div>
  );
};

const StatsLoader = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-3xl border border-slate-100 animate-pulse"
        >
          <div className="w-12 h-12 bg-slate-100 rounded-2xl mb-4" />
          <div className="h-4 bg-slate-100 rounded w-1/2 mb-2" />
          <div className="h-8 bg-slate-100 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
};

const SurveyCard = ({ survey }: { survey: Survey }) => {
  const { user } = useAuthStore();

  return (
    <div className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            survey.isActive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {survey.isActive ? "Active" : "Draft"}
        </span>
        <span className="text-slate-400">
          <Users size={18} />
        </span>
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
        {survey.title}
      </h3>
      <p className="text-slate-500 text-sm mb-6 line-clamp-2 min-h-[40px]">
        {survey.description || "No description provided."}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <Calendar size={14} />
          {new Date(survey.createdAt).toLocaleDateString()}
        </div>
        <RoleGuard allowedRoles={[UserRole.OFFICER]}>
          <Link
            to={`/surveys/${survey.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all whitespace-nowrap text-sm font-semibold"
          >
            <span>Take Survey</span>
            <ArrowRight size={18} />
          </Link>
        </RoleGuard>
      </div>
    </div>
  );
};

const EmptyList = () => {
  return (
    <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center">
      <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
        <ClipboardList size={32} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">
        No surveys found
      </h3>
      <RoleGuard allowedRoles={[UserRole.OFFICER]}>
        <p className="text-slate-400 font-medium mb-6">
          No surveys have been assigned to you
        </p>
      </RoleGuard>
      <RoleGuard allowedRoles={[UserRole.ADMIN]}>
        <p className="text-slate-400 font-medium mb-6">
          You haven't created any surveys yet.
        </p>
        <Link
          to={RoutePath.NEW_SURVEY}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          Create Your First Survey
        </Link>
      </RoleGuard>
    </div>
  );
};

const StatsGrid = () => {
  const { stats, isStatsLoading } = useSurvey();

  const dashboardStats = [
    {
      label: "Active Surveys",
      value: stats?.activeSurveys,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Officers",
      value: stats?.totalOfficers,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Submissions Today",
      value: stats?.totalSurveySubmissionToday,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  if (isStatsLoading) {
    return <StatsLoader />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {dashboardStats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200"
        >
          <div
            className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}
          >
            <stat.icon size={24} />
          </div>
          <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
          <p className="text-2xl font-bold text-slate-900">
            {/* Display actual value from API or fallback to 0 */}
            {stat.value ?? 0}
          </p>
        </div>
      ))}
    </div>
  );
};
