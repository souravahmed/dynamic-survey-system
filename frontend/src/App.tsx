import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // [1] Import Provider
import Login from "./components/Login";
import Register from "./components/Register";
import { RoutePath } from "./constants/routePath";
import { useAuthStore } from "@/store/authStore";
import Dashboard from "./components/Dashboard";

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
            <Route path={RoutePath.LOGIN} element={<Login />} />
            <Route path={RoutePath.REGISTER} element={<Register />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path={RoutePath.DASHBOARD} element={<Dashboard />} />
            {/* Add more protected routes here */}
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
