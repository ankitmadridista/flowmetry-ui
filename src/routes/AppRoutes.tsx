import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ObjId } from "../features/auth/permissions";
import PermissionRoute from "../features/auth/components/PermissionRoute";

const DashboardPage = lazy(() => import("../features/dashboard/DashboardPage"));
const InvoiceListPage = lazy(
  () => import("../features/invoices/pages/InvoiceListPage"),
);
const InvoiceDetailPage = lazy(
  () => import("../features/invoices/pages/InvoiceDetailPage"),
);
const CustomerListPage = lazy(
  () => import("../features/customers/CustomerListPage"),
);
const CustomerDetailPage = lazy(
  () => import("../features/customers/CustomerDetailPage"),
);
const SecurityAdminPage = lazy(
  () => import("../features/security-admin/SecurityAdminPage"),
);

const PageLoader = () => (
  <div className="flex items-center justify-center h-[50vh]">
    <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
  );
}
