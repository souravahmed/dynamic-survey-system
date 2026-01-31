import { getAxiosInstance } from "@/configs/axiosConfig";
import { SurveySubmission, SurveySubmissionPayload } from "@/interfaces";

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
};
