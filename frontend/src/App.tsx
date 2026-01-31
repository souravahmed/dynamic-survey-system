import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // [1] Import Provider
import { RoutePath } from "./constants/routePath";
import { useAuthStore } from "@/store/authStore";
import { NewSurveyPage } from "./pages/NewSurveyPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { FillSurveyPage } from "./pages/FillSurveyPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { SubmissionsPage } from "./pages/SubmissionPage";

const queryClient = new QueryClient();

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={RoutePath.LOGIN} replace />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={RoutePath.DASHBOARD} replace />;
  }

  return <Outlet />;
};

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to={isAuthenticated ? RoutePath.DASHBOARD : RoutePath.LOGIN}
                replace
              />
            }
          />

          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path={RoutePath.LOGIN} element={<LoginPage />} />
            <Route path={RoutePath.REGISTER} element={<RegisterPage />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path={RoutePath.DASHBOARD} element={<DashboardPage />} />
              <Route path={RoutePath.NEW_SURVEY} element={<NewSurveyPage />} />
              <Route
                path={RoutePath.SUBMISSIONS}
                element={<SubmissionsPage />}
              />
              <Route path="/surveys/:id" element={<FillSurveyPage />} />
            </Route>
          </Route>

          {/* Catch-all: Redirect any unknown route to Dashboard */}
          {/* If the user is logged out, ProtectedRoute will then kick them to Login */}
          <Route
            path="*"
            element={<Navigate to={RoutePath.DASHBOARD} replace />}
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
