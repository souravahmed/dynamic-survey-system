import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { useAuthStore } from "../store/authStore";
import { UrlUtil } from "@/utils/urlUtil";

let axiosInstance: AxiosInstance | null = null;

export const getAxiosInstance = (): AxiosInstance => {
  // Return the existing axiosInstance if it already exists
  if (axiosInstance) {
    return axiosInstance;
  }

  // Create a new instance and store it for future use
  axiosInstance = axios.create({
    baseURL: UrlUtil.getBaseUrl(),
    headers: {
      "Content-Type": "application/json",
    },
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const user = useAuthStore.getState().user;
      if (user?.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    },
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error) => {
      if (error.response) {
        const apiError = {
          statusCode: error.response.status,
          error: error.response.data.error || "Unknown Error",
          message: error.response.data.message || "Something went wrong",
          path: error.response.data.path || "",
        };
        return Promise.reject(apiError);
      }
      return Promise.reject(error);
    },
  );

  return axiosInstance;
};
