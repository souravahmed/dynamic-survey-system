import DashboardLayout from "./DashboardLayout";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/enums/userRole";
import { DASHBOARD_STATS } from "@/constants/dashboardStats";

export default function Dashboard() {
  const { user } = useAuthStore();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.role}!
          </h1>
          <p className="text-slate-500">
            Here's what's happening with your surveys today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {DASHBOARD_STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div
                className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}
              >
                <stat.icon size={24} />
              </div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Placeholder for Main Content */}
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
          <p className="text-slate-400 font-medium">
            {user?.role === UserRole.ADMIN
              ? "Your recent survey trends will appear here."
              : "Assigned surveys will appear here."}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
