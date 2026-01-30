import { ReactNode } from "react";
import { useAuthStore } from "@/store/authStore";
import { ClipboardList, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Footer from "./Footer";
import { getMenuItems } from "@/constants/sidebarNavigation";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const menuItems = user ? getMenuItems(user.role) : [];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="p-6">
          <div className="flex items-center gap-3 text-indigo-600 font-bold text-xl">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <ClipboardList size={20} />
            </div>
            <span className="leading-tight">DSS</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 mb-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Signed in as
            </p>
            <p className="text-sm font-semibold text-slate-900 truncate">
              {user?.email}
            </p>
            <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full uppercase font-bold">
              {user?.role}
            </span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all rounded-xl cursor-pointer"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
          <div className="flex-1 md:flex-none">
            <h2 className="text-lg font-bold text-slate-800">
              {menuItems.find((item) => item.path === location.pathname)
                ?.label || "Dashboard"}
            </h2>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">{children}</div>
        <Footer />
      </main>
    </div>
  );
}
