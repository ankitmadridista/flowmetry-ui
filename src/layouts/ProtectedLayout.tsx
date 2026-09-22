import { Navigate } from "react-router-dom";
import AppNavbar from "../shared/components/AppNavbar";
import Footer from "../shared/components/Footer";
import AppRoutes from "../routes/AppRoutes";
import { useAuth } from "../features/auth/contexts/AuthContext";
import { PermissionProvider } from "../features/auth/contexts/PermissionContext";

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <PermissionProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <AppNavbar />
        <main className="grow">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </PermissionProvider>
  );
}
