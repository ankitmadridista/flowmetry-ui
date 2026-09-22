import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./features/auth/LoginPage";
import "./features/dashboard/dashboard.css";
import ProtectedLayout from "./layouts/ProtectedLayout";
import { useAuth } from "./features/auth/contexts/AuthContext";

export default function App(): React.JSX.Element {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LandingPage />
          )
        }
      />
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
}
