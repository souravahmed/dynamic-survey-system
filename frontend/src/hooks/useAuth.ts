import { RoutePath } from "@/constants/routePath";
import { RegisterData } from "@/interfaces";
import { AuthService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const signupMutation = useMutation({
    mutationFn: async (payload: RegisterData) => {
      const response = await AuthService.signup(payload);
      return response;
    },
    onSuccess: (data) => {
      toast.success("Registration successful!");
      login(data);
      navigate(RoutePath.DASHBOARD);
    },
    onError: (error) => {
      toast.error(error.message || "Signup failed");
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const response = await AuthService.login(payload);
      return response;
    },
    onSuccess: (data) => {
      login(data);
      navigate(RoutePath.DASHBOARD);
    },
    onError: (error) => {
      toast.error(error.message || "Login failed");
    },
  });

  return {
    signup: signupMutation.mutate,
    signupState: signupMutation,

    login: loginMutation.mutate,
    loginState: loginMutation,
  };
};
