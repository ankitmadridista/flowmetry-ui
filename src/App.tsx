import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { type ReactNode } from "react";

import DashboardPage from "./features/dashboard/DashboardPage";
import InvoiceListPage from "./features/invoices/InvoiceListPage";
import InvoiceDetailPage from "./features/invoices/InvoiceDetailPage";
import CustomerListPage from "./features/customers/CustomerListPage";
import CustomerDetailPage from "./features/customers/CustomerDetailPage";
import LoginPage from "./features/auth/LoginPage";
import SecurityAdminPage from "./features/security-admin/SecurityAdminPage";
import { useAuth } from "./features/auth/AuthContext";
import {
  PermissionProvider,
  usePermissionContext,
} from "./features/auth/PermissionContext";
import {
  useObjectEnabled,
  usePermission,
} from "./features/auth/usePermissions";
import { ObjId, OpId } from "./features/auth/permissions";
import "./features/dashboard/dashboard.css";

import LandingPage from "./pages/LandingPage";
import Footer from "./shared/components/Footer";
import Navbar from "./shared/components/Navbar";

function AccessDenied() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-center">
      <span className="text-5xl">🔒</span>
      <h2 className="text-heading font-heading font-semibold m-0 text-2xl">
        Access Restricted
      </h2>
      <p className="text-foreground/60 m-0">
        You don't have permission to view this page.
      </p>
      <button
        className="px-4 py-2 mt-2 font-medium bg-accent text-white rounded-md hover:bg-accent/90 transition-colors shadow-theme"
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>
    </div>
  );
}

function PermissionRoute({
  objId,
  children,
}: {
  objId: number;
  children: ReactNode;
}) {
  const { loading } = usePermissionContext();
  const canView = usePermission(objId, OpId.VIEW);

  if (loading) return null;
  if (!canView) return <AccessDenied />;
  return <>{children}</>;
}

// Private Navbar built on top of the generic BaseNavbar
function AppNavbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isDashboardEnabled = useObjectEnabled(ObjId.DASHBOARD);
  const canViewDashboard = usePermission(ObjId.DASHBOARD, OpId.VIEW);
  const isInvoicesEnabled = useObjectEnabled(ObjId.INVOICES);
  const canViewInvoices = usePermission(ObjId.INVOICES, OpId.VIEW);
  const isCustomersEnabled = useObjectEnabled(ObjId.CUSTOMERS);
  const canViewCustomers = usePermission(ObjId.CUSTOMERS, OpId.VIEW);
  const isSecurityEnabled = useObjectEnabled(ObjId.SECURITY);
  const canViewSecurity = usePermission(ObjId.SECURITY, OpId.VIEW);

  const showDashboard = isDashboardEnabled && canViewDashboard;
  const showInvoices = isInvoicesEnabled && canViewInvoices;
  const showCustomers = isCustomersEnabled && canViewCustomers;
  const showSecurity = isSecurityEnabled && canViewSecurity;

  const isActive = (path: string) => pathname.startsWith(path);

  const navLinkClass = (path: string) =>
    `font-medium transition-colors ${isActive(path) ? "text-accent" : "text-foreground hover:text-heading"}`;

  const links = (
    <>
      {showDashboard && (
        <button
          className={navLinkClass("/dashboard")}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>
      )}
      {showInvoices && (
        <button
          className={navLinkClass("/invoices")}
          onClick={() => navigate("/invoices")}
        >
          Invoices
        </button>
      )}
      {showCustomers && (
        <button
          className={navLinkClass("/customers")}
          onClick={() => navigate("/customers")}
        >
          Customers
        </button>
      )}
      {showSecurity && (
        <button
          className={navLinkClass("/security")}
          onClick={() => navigate("/security")}
        >
          Security
        </button>
      )}
    </>
  );

  const actions = (
    <>
      <span className="text-sm font-medium text-foreground hidden sm:block">
        {user?.displayName}
      </span>
      <button
        className="px-4 py-2 font-medium border border-border text-foreground rounded-md hover:bg-code transition-colors"
        onClick={signOut}
      >
        Sign out
      </button>
    </>
  );

  const mobileContent = (
    <>
      {links}
      <hr className="border-border my-2" />
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground px-2">
          {user?.displayName}
        </span>
        {actions}
      </div>
    </>
  );

  return (
    <Navbar
      navLinks={links}
      actionButtons={actions}
      mobileMenuContent={mobileContent}
    />
  );
}

// Wrapper for the authenticated portion of the app
function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <PermissionProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <AppNavbar />
        <main className="grow">
          <Routes>
            <Route
              path="/dashboard"
              element={
                <PermissionRoute objId={ObjId.DASHBOARD}>
                  <DashboardPage />
                </PermissionRoute>
              }
            />
            <Route
              path="/invoices"
              element={
                <PermissionRoute objId={ObjId.INVOICES}>
                  <InvoiceListPage />
                </PermissionRoute>
              }
            />
            <Route
              path="/invoices/:id"
              element={
                <PermissionRoute objId={ObjId.INVOICES}>
                  <InvoiceDetailPage />
                </PermissionRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <PermissionRoute objId={ObjId.CUSTOMERS}>
                  <CustomerListPage />
                </PermissionRoute>
              }
            />
            <Route
              path="/customers/:id"
              element={
                <PermissionRoute objId={ObjId.CUSTOMERS}>
                  <CustomerDetailPage />
                </PermissionRoute>
              }
            />
            <Route
              path="/security"
              element={
                <PermissionRoute objId={ObjId.SECURITY}>
                  <SecurityAdminPage />
                </PermissionRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </PermissionProvider>
  );
}

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
