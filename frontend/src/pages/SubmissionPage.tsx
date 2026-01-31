import { SubmissionsTable } from "@/components/SubmissionsTable";
import { useSurveySubmission } from "@/hooks/useSurveySubmission";
import { useState } from "react";

export const SubmissionsPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { submissions, isLoadingSubmissions } = useSurveySubmission(
    page,
    limit,
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">All Submissions</h1>
        <p className="text-slate-500">
          Review all activity across all your surveys.
        </p>
      </div>

      <SubmissionsTable
        response={submissions}
        page={page}
        limit={limit}
        isLoading={isLoadingSubmissions}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />
    </div>
  );
};
