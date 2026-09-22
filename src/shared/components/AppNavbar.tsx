import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/contexts/AuthContext";
import {
  useObjectEnabled,
  usePermission,
} from "../../features/auth/hooks/usePermissions";
import { ObjId, OpId } from "../../features/auth/permissions";
import Navbar from "./Navbar";

export default function AppNavbar() {
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
