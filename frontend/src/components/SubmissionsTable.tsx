import {
  Calendar,
  User,
  FileText,
  ChevronDown,
  ChevronUp,
  MessageSquareText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PaginatedResponse, SurveySubmission } from "@/interfaces";
import React, { useState } from "react";

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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-10"></th>
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
              response.data.map((sub) => (
                <React.Fragment key={sub.id}>
                  {/* MAIN ROW */}
                  <tr
                    onClick={() => toggleRow(sub.id)}
                    className={`cursor-pointer transition-colors ${expandedId === sub.id ? "bg-indigo-50/30" : "hover:bg-slate-50/50"}`}
                  >
                    <td className="p-4 text-slate-400">
                      {expandedId === sub.id ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white border border-slate-200 text-indigo-600 rounded-lg shadow-sm">
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

                  {/* 2. EXPANDABLE ANSWER SECTION */}
                  {expandedId === sub.id && (
                    <tr>
                      <td colSpan={4} className="p-0 bg-slate-50/50">
                        <div className="px-14 py-6 animate-in slide-in-from-top-2 duration-200">
                          <div className="flex items-center gap-2 mb-4">
                            <MessageSquareText
                              size={16}
                              className="text-indigo-500"
                            />
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                              Submitted Responses
                            </h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {sub.answers?.map((ans) => (
                              <div
                                key={ans.id}
                                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"
                              >
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                                  Question: {ans.field?.label}
                                </p>
                                <p className="text-sm font-semibold text-slate-800 mb-2">
                                  Response :
                                </p>
                                <div className="text-sm text-indigo-600 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 font-medium">
                                  {ans.value || (
                                    <span className="italic text-slate-400">
                                      No response provided
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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
