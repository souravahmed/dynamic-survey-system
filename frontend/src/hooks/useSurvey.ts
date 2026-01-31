import { QUERY_KEYS } from "@/constants/queryKeys";
import { RoutePath } from "@/constants/routePath";
import { SurveyPayload } from "@/interfaces";
import { SurveyService } from "@/services/surveyService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useSurvey = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const surveyMutation = useMutation({
    mutationFn: (payload: SurveyPayload) => {
      const response = SurveyService.create(payload);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SURVEYS] });
      toast.success("Survey created successfully!");
      navigate(RoutePath.DASHBOARD);
    },
    onError: (error) => {
      toast.error(error.message || "Survey creation failed");
    },
  });

  const allSurveys = useQuery({
    queryKey: [QUERY_KEYS.SURVEYS],
    queryFn: SurveyService.getAll,
  });

  const stats = useQuery({
    queryKey: [QUERY_KEYS.STATS],
    queryFn: SurveyService.getStats,
  });

  return {
    createSurvey: surveyMutation.mutate,

    isCreating: surveyMutation.isPending,
    isLoadingList: allSurveys.isLoading,
    isStatsLoading: stats.isLoading,

    stats: stats.data,
    surveys: allSurveys.data ?? [],
  };
};
