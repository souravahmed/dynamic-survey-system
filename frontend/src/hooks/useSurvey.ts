import { RoutePath } from "@/constants/routePath";
import { SurveyPayload } from "@/interfaces";
import { SurveyService } from "@/services/surveyService";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useSurvey = () => {
  const navigate = useNavigate();

  const surveyMutation = useMutation({
    mutationFn: async (payload: SurveyPayload) => {
      const response = await SurveyService.create(payload);
      return response;
    },
    onSuccess: () => {
      toast.success("Survey created successfully!");
      navigate(RoutePath.DASHBOARD);
    },
    onError: (error) => {
      toast.error(error.message || "Survey creation failed");
    },
  });

  return {
    createSurvey: surveyMutation.mutate,
    surveyState: surveyMutation,
  };
};
