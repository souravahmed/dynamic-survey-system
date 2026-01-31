import { getAxiosInstance } from "@/configs/axiosConfig";
import { Stats, Survey, SurveyPayload } from "@/interfaces";

const axiosInstance = getAxiosInstance();

export const SurveyService = {
  create: async (payload: SurveyPayload): Promise<Survey> => {
    const { data } = await axiosInstance.post<Survey>("/surveys", payload);
    return data;
  },

  getById: async (id: string): Promise<Survey> => {
    const { data } = await axiosInstance.get<Survey>(`/surveys/${id}`);
    return data;
  },

  getAll: async (): Promise<Survey[]> => {
    const { data } = await axiosInstance.get<Survey[]>("/surveys");
    return data;
  },

  getStats: async (): Promise<Stats> => {
    const { data } = await axiosInstance.get<Stats>("/surveys/stats");
    return data;
  },
};
