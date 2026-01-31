import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PaginatedResponse, SurveySubmission } from "@/interfaces";

interface Props {
  response: PaginatedResponse<SurveySubmission>;
  isLoading: boolean;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
}
export const SubmissionsTable = ({
  response,
  isLoading,
  page,
  limit,
  onPageChange,
  onLimitChange,
}: Props) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                Survey Title
              </th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                Submitted By
              </th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
            ) : response?.data?.length > 0 ? (
              response?.data?.map((sub) => (
                <tr
                  key={sub.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <FileText size={16} />
                      </div>
                      <span className="font-semibold text-slate-700">
                        {sub.survey?.title}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-slate-400" />
                      {sub.submittedBy?.name || "Anonymous"}
                    </div>
                  </td>
                  <td className="p-4 text-slate-500 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="p-12 text-center text-slate-400 font-medium italic"
                >
                  No submissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 bg-slate-50/50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 font-medium">
            Items per page:
          </span>
          <select
            value={limit}
            onChange={(e) => {
              onLimitChange(Number(e.target.value));
              onPageChange(1);
            }}
            className="bg-white border border-slate-200 rounded-lg text-sm px-2 py-1 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer text-slate-900"
          >
            {[5, 10, 20, 50].map((v) => (
              <option key={v} value={v} className="bg-white text-slate-900">
                {v}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm text-slate-500 font-semibold">
            Page {response?.page || 1} of {response?.totalPages || 1}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1 || isLoading}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= (response?.totalPages || 1) || isLoading}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-slate-50">
    <td className="p-4">
      <div className="h-4 bg-slate-100 rounded w-3/4"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-slate-100 rounded w-1/2"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-slate-100 rounded w-1/3"></div>
    </td>
    <td className="p-4">
      <div className="h-8 bg-slate-100 rounded w-8 ml-auto"></div>
    </td>
  </tr>
);
