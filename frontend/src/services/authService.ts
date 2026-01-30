import { getAxiosInstance } from "@/configs/axiosConfig";
import { RegisterData, User } from "@/interfaces";

const axiosInstance = getAxiosInstance();

export const AuthService = {
  login: async (payload: {
    email: string;
    password: string;
  }): Promise<User> => {
    const { data } = await axiosInstance.post<User>("/auth/login", payload);
    return data;
  },

  signup: async (payload: RegisterData): Promise<User> => {
    const { data } = await axiosInstance.post<User>("/auth/register", payload);
    return data;
  },
};
