import { getAxiosInstance } from "@/configs/axiosConfig";
import { RegisterPayload, User } from "@/interfaces";

const axiosInstance = getAxiosInstance();

export const AuthService = {
  login: async (payload: {
    email: string;
    password: string;
  }): Promise<User> => {
    const { data } = await axiosInstance.post<User>("/auth/signin", payload);
    return data;
  },

  signup: async (payload: RegisterPayload): Promise<User> => {
    const { data } = await axiosInstance.post<User>("/auth/register", payload);
    return data;
  },
};
