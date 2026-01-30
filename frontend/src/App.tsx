import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // [1] Import Provider
import Login from "./components/Login";
import Register from "./components/Register";
import { RoutePath } from "./constants/routePath";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Navigate to={RoutePath.LOGIN} />} />
          <Route path={RoutePath.LOGIN} element={<Login />} />
          <Route path={RoutePath.REGISTER} element={<Register />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
