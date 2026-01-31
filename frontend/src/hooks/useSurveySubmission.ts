import { QUERY_KEYS } from "@/constants/queryKeys";
import { RoutePath } from "@/constants/routePath";
import { SurveySubmissionPayload } from "@/interfaces";
import { SurveySubmissionService } from "@/services/surveySubmission";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useSurveySubmission = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const submitMutation = useMutation({
    mutationFn: (payload: SurveySubmissionPayload) =>
      SurveySubmissionService.submit(payload),
    onSuccess: () => {
      toast.success("Survey submitted successfully!");
      navigate(RoutePath.DASHBOARD);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SURVEYS] });
    },
    onError: () => toast.error("Failed to submit survey"),
  });

  return {
    submitSurvey: submitMutation.mutate,
    isSubmitting: submitMutation.isPending,
  };
};
