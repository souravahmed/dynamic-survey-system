import { getAxiosInstance } from "@/configs/axiosConfig";
import { Survey, SurveyPayload } from "@/interfaces";

const axiosInstance = getAxiosInstance();

export const SurveyService = {
  create: async (payload: SurveyPayload): Promise<Survey> => {
    const { data } = await axiosInstance.post<Survey>("/surveys", payload);
    return data;
  },
};
