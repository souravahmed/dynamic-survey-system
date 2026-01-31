import { getAxiosInstance } from "@/configs/axiosConfig";
import {
  PaginatedResponse,
  SurveySubmission,
  SurveySubmissionPayload,
} from "@/interfaces";

const axiosInstance = getAxiosInstance();

export const SurveySubmissionService = {
  submit: async (
    payload: SurveySubmissionPayload,
  ): Promise<SurveySubmission> => {
    const { data } = await axiosInstance.post<SurveySubmission>(
      "/survey-submissions",
      payload,
    );
    return data;
  },
  getSurveySubmissions: async (
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<SurveySubmission>> => {
    const { data } = await axiosInstance.get<
      PaginatedResponse<SurveySubmission>
    >(`/survey-submissions/survey/?page=${page}&limit=${limit}`);
    return data;
  },
};
