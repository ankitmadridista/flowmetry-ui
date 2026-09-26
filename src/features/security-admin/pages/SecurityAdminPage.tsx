import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useObjectEnabled,
  usePermission,
} from "../../auth/hooks/usePermissions";
import { ObjId, OpId, PERMISSION_MAP } from "../../auth/permissions";
import {
  getSecurityObjects,
  patchSecurityObject,
  getRoles,
  addPermissionToRole,
  removePermissionFromRole,
  getUsers,
  addRoleToUser,
  removeRoleFromUser,
} from "../api/security-admin.api";
import type {
  SecurityObjectDto,
  RoleWithPermissionsDto,
  UserWithRolesDto,
} from "../api/security-admin.api";
// import './security-admin.css'; <-- Removed!

// Shared UI Classes
const cardClass =
  "bg-background border border-border rounded-xl overflow-hidden shadow-sm";
const emptyClass = "text-center py-10 px-5 text-foreground/60 text-[15px]";
const rowErrorClass =
  "text-xs text-red-700 dark:text-red-400 mt-1 font-medium w-full";
const btnPrimaryClass =
  "h-[28px] px-3 bg-accent text-white border-none rounded-md text-xs font-semibold cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-theme";
const selectClass =
  "h-[32px] px-2.5 border border-border rounded-md bg-background text-heading text-[13px] outline-none transition-colors focus:border-accent w-full max-w-[280px]";

// ── AccessDenied ──────────────────────────────────────────────────────────────
function AccessDenied() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-4 py-8">
      <span className="text-5xl">🔒</span>
      <h2 className="m-0 text-2xl font-heading font-semibold text-heading">
        Access Restricted
      </h2>
      <p className="m-0 text-foreground/60">
        You don't have permission to view this page.
      </p>
      <button
        className="mt-2 h-9.5 px-5 bg-accent text-white border-none rounded-md text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity shadow-theme"
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>
    </div>
  );
}

// ── Static permission label map ───────────────────────────────────────────────
const PERMISSION_LABELS: Record<number, string> = {
  1: "Dashboard – View",
  2: "Dashboard – Create",
  3: "Dashboard – Edit",
  4: "Dashboard – Delete",
  5: "Invoices – View",
  6: "Invoices – Create",
  7: "Invoices – Edit",
  8: "Invoices – Delete",
  9: "Customers – View",
  10: "Customers – Create",
  11: "Customers – Edit",
  12: "Customers – Delete",
  13: "Payments – View",
  14: "Payments – Create",
  15: "Payments – Edit",
  16: "Payments – Delete",
  17: "Reports – View",
  18: "Reports – Create",
  19: "Reports – Edit",
  20: "Reports – Delete",
  21: "Security – View",
  22: "Security – Edit",
  23: "Security – Manage",
};

const ALL_PERMISSION_IDS = Object.keys(PERMISSION_MAP).map(Number);

// ── Objects Tab ───────────────────────────────────────────────────────────────
function ObjectsTab({ canMutate }: { canMutate: boolean }) {
  const [objects, setObjects] = useState<SecurityObjectDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rowError, setRowError] = useState<Record<number, string>>({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getSecurityObjects()
      .then((data) => {
        if (!cancelled) setObjects(data);
      })
      .catch((err) => {
        if (!cancelled) setError((err as Error).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleToggle(item: SecurityObjectDto) {
    const prev = objects;
    setObjects((objs) =>
      objs.map((o) =>
        o.id === item.id ? { ...o, isEnabled: !o.isEnabled } : o,
      ),
    );
    setRowError((e) => ({ ...e, [item.id]: "" }));
    try {
      const updated = await patchSecurityObject(item.id, !item.isEnabled);
      setObjects((objs) =>
        objs.map((o) => (o.id === updated.id ? updated : o)),
      );
    } catch (err) {
      setObjects(prev);
      setRowError((e) => ({ ...e, [item.id]: (err as Error).message }));
    }
  }

  if (loading) return <div className={emptyClass}>Loading…</div>;
  if (error)
    return (
      <p
        className="my-8 mx-4 md:mx-10 bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-900 rounded-lg py-3.5 px-4 text-sm"
        role="alert"
      >
        {error}
      </p>
    );

  const roots = objects.filter((o) => o.parentId === null);
  const children = objects.filter((o) => o.parentId !== null);

  const rows: Array<{ item: SecurityObjectDto; indent: boolean }> = [];
  for (const root of roots) {
    rows.push({ item: root, indent: false });
    for (const child of children.filter((c) => c.parentId === root.id)) {
      rows.push({ item: child, indent: true });
    }
  }
  for (const child of children.filter(
    (c) => !roots.some((r) => r.id === c.parentId),
  )) {
    rows.push({ item: child, indent: false });
  }

  return (
    <div className={cardClass}>
      {rows.map(({ item, indent }) => {
        const showToggle = canMutate && item.id !== 7;
        return (
          <div
            key={item.id}
            className={`flex flex-wrap items-center gap-2 sm:gap-3 py-3 px-4 border-b border-border last:border-b-0 text-sm hover:bg-accent-bg/30 transition-colors ${indent ? "pl-8 sm:pl-10" : ""}`}
          >
            <span
              className={`flex-1 text-heading truncate ${indent ? "" : "font-semibold"}`}
            >
              {item.title}
            </span>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.4px] whitespace-nowrap shrink-0 ${item.isEnabled ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"}`}
            >
              {item.isEnabled ? "Enabled" : "Disabled"}
            </span>
            {showToggle && (
              <button
                className={btnPrimaryClass}
                onClick={() => handleToggle(item)}
                aria-label={`${item.isEnabled ? "Disable" : "Enable"} ${item.title}`}
              >
                {item.isEnabled ? "Disable" : "Enable"}
              </button>
            )}
            {rowError[item.id] && (
              <span className={rowErrorClass}>{rowError[item.id]}</span>
            )}
          </div>
        );
      })}
      {rows.length === 0 && <div className={emptyClass}>No objects found.</div>}
    </div>
  );
}

// ── Roles Tab ─────────────────────────────────────────────────────────────────
function RolesTab({ canMutate }: { canMutate: boolean }) {
  const [roles, setRoles] = useState<RoleWithPermissionsDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rowError, setRowError] = useState<Record<number, string>>({});
  const [selectedPerm, setSelectedPerm] = useState<Record<number, number>>({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getRoles()
      .then((data) => {
        if (!cancelled) setRoles(data);
      })
      .catch((err) => {
        if (!cancelled) setError((err as Error).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAddPermission(role: RoleWithPermissionsDto) {
    const permId = selectedPerm[role.id];
    if (!permId) return;
    const prev = roles;
    setRoles((rs) =>
      rs.map((r) =>
        r.id === role.id
          ? { ...r, permissionIds: [...new Set([...r.permissionIds, permId])] }
          : r,
      ),
    );
    setRowError((e) => ({ ...e, [role.id]: "" }));
    try {
      const updated = await addPermissionToRole(role.id, permId);
      setRoles((rs) => rs.map((r) => (r.id === updated.id ? updated : r)));
    } catch (err) {
      setRoles(prev);
      setRowError((e) => ({ ...e, [role.id]: (err as Error).message }));
    }
  }

  async function handleRemovePermission(
    role: RoleWithPermissionsDto,
    permId: number,
  ) {
    const prev = roles;
    setRoles((rs) =>
      rs.map((r) =>
        r.id === role.id
          ? { ...r, permissionIds: r.permissionIds.filter((p) => p !== permId) }
          : r,
      ),
    );
    setRowError((e) => ({ ...e, [role.id]: "" }));
    try {
      const updated = await removePermissionFromRole(role.id, permId);
      setRoles((rs) => rs.map((r) => (r.id === updated.id ? updated : r)));
    } catch (err) {
      setRoles(prev);
      setRowError((e) => ({ ...e, [role.id]: (err as Error).message }));
    }
  }

  if (loading) return <div className={emptyClass}>Loading…</div>;
  if (error)
    return (
      <p
        className="my-8 mx-4 md:mx-10 bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-900 rounded-lg py-3.5 px-4 text-sm"
        role="alert"
      >
        {error}
      </p>
    );

  return (
    <div className={cardClass}>
      {roles.map((role) => {
        const availablePerms = ALL_PERMISSION_IDS.filter(
          (id) => !role.permissionIds.includes(id),
        );
        return (
          <div
            key={role.id}
            className="py-3.5 px-4 sm:px-5 border-b border-border last:border-b-0 text-sm"
          >
            <div className="font-semibold text-heading mb-2">
              {role.roleName}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {role.permissionIds.length === 0 && (
                <span className="text-[12px] text-foreground/60">
                  No permissions
                </span>
              )}
              {role.permissionIds.map((pid) => (
                <span
                  key={pid}
                  className="inline-flex items-center gap-1 pl-2 pr-0.5 py-0.5 bg-accent-bg text-accent rounded-md text-xs font-medium"
                >
                  {PERMISSION_LABELS[pid] ?? `Permission ${pid}`}
                  {canMutate && (
                    <button
                      className="h-4 px-1 ml-1 bg-transparent text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-sm text-[13px] leading-none cursor-pointer flex items-center transition-colors border-none"
                      onClick={() => handleRemovePermission(role, pid)}
                      aria-label={`Remove permission ${pid} from ${role.roleName}`}
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
            {canMutate && (
              <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                <select
                  className={selectClass}
                  value={selectedPerm[role.id] ?? ""}
                  onChange={(e) =>
                    setSelectedPerm((s) => ({
                      ...s,
                      [role.id]: Number(e.target.value),
                    }))
                  }
                  aria-label={`Select permission to add to ${role.roleName}`}
                >
                  <option value="">Add permission…</option>
                  {availablePerms.map((pid) => (
                    <option key={pid} value={pid}>
                      {PERMISSION_LABELS[pid] ?? `Permission ${pid}`}
                    </option>
                  ))}
                </select>
                <button
                  className={`${btnPrimaryClass} h-8! px-3.5!`}
                  onClick={() => handleAddPermission(role)}
                  disabled={!selectedPerm[role.id]}
                  aria-label={`Add selected permission to ${role.roleName}`}
                >
                  Add
                </button>
              </div>
            )}
            {rowError[role.id] && (
              <p className={rowErrorClass}>{rowError[role.id]}</p>
            )}
          </div>
        );
      })}
      {roles.length === 0 && <div className={emptyClass}>No roles found.</div>}
    </div>
  );
}

// ── Users Tab ─────────────────────────────────────────────────────────────────
function UsersTab({ canMutate }: { canMutate: boolean }) {
  const [users, setUsers] = useState<UserWithRolesDto[]>([]);
  const [roles, setRoles] = useState<RoleWithPermissionsDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rowError, setRowError] = useState<Record<string, string>>({});
  const [selectedRole, setSelectedRole] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([getUsers(), getRoles()])
      .then(([u, r]) => {
        if (!cancelled) {
          setUsers(u);
          setRoles(r);
        }
      })
      .catch((err) => {
        if (!cancelled) setError((err as Error).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function roleName(roleId: number): string {
    return roles.find((r) => r.id === roleId)?.roleName ?? `Role ${roleId}`;
  }

  async function handleAddRole(user: UserWithRolesDto) {
    const roleId = selectedRole[user.userId];
    if (!roleId) return;
    const prev = users;
    setUsers((us) =>
      us.map((u) =>
        u.userId === user.userId
          ? { ...u, roleIds: [...new Set([...u.roleIds, roleId])] }
          : u,
      ),
    );
    setRowError((e) => ({ ...e, [user.userId]: "" }));
    try {
      const updated = await addRoleToUser(user.userId, roleId);
      setUsers((us) =>
        us.map((u) => (u.userId === updated.userId ? updated : u)),
      );
    } catch (err) {
      setUsers(prev);
      setRowError((e) => ({ ...e, [user.userId]: (err as Error).message }));
    }
  }

  async function handleRemoveRole(user: UserWithRolesDto, roleId: number) {
    const prev = users;
    setUsers((us) =>
      us.map((u) =>
        u.userId === user.userId
          ? { ...u, roleIds: u.roleIds.filter((r) => r !== roleId) }
          : u,
      ),
    );
    setRowError((e) => ({ ...e, [user.userId]: "" }));
    try {
      const updated = await removeRoleFromUser(user.userId, roleId);
      setUsers((us) =>
        us.map((u) => (u.userId === updated.userId ? updated : u)),
      );
    } catch (err) {
      setUsers(prev);
      setRowError((e) => ({ ...e, [user.userId]: (err as Error).message }));
    }
  }

  if (loading) return <div className={emptyClass}>Loading…</div>;
  if (error)
    return (
      <p
        className="my-8 mx-4 md:mx-10 bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-900 rounded-lg py-3.5 px-4 text-sm"
        role="alert"
      >
        {error}
      </p>
    );

  return (
    <div className={cardClass}>
      {users.map((user) => {
        const availableRoles = roles.filter(
          (r) => !user.roleIds.includes(r.id),
        );
        const displayName = user.displayName || user.email;
        return (
          <div
            key={user.userId}
            className="py-3.5 px-4 sm:px-5 border-b border-border last:border-b-0 text-sm"
          >
            <div className="font-semibold text-heading mb-2">{displayName}</div>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {user.roleIds.length === 0 && (
                <span className="text-[12px] text-foreground/60">No roles</span>
              )}
              {user.roleIds.map((rid) => (
                <span
                  key={rid}
                  className="inline-flex items-center gap-1 pl-2 pr-0.5 py-0.5 bg-accent-bg text-accent rounded-md text-xs font-medium"
                >
                  {roleName(rid)}
                  {canMutate && (
                    <button
                      className="h-4 px-1 ml-1 bg-transparent text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-sm text-[13px] leading-none cursor-pointer flex items-center transition-colors border-none"
                      onClick={() => handleRemoveRole(user, rid)}
                      aria-label={`Remove role ${rid} from ${displayName}`}
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
            {canMutate && (
              <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                <select
                  className={selectClass}
                  value={selectedRole[user.userId] ?? ""}
                  onChange={(e) =>
                    setSelectedRole((s) => ({
                      ...s,
                      [user.userId]: Number(e.target.value),
                    }))
                  }
                  aria-label={`Select role to add to ${displayName}`}
                >
                  <option value="">Add role…</option>
                  {availableRoles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.roleName}
                    </option>
                  ))}
                </select>
                <button
                  className={`${btnPrimaryClass} h-8! px-3.5!`}
                  onClick={() => handleAddRole(user)}
                  disabled={!selectedRole[user.userId]}
                  aria-label={`Add selected role to ${displayName}`}
                >
                  Add
                </button>
              </div>
            )}
            {rowError[user.userId] && (
              <p className={rowErrorClass}>{rowError[user.userId]}</p>
            )}
          </div>
        );
      })}
      {users.length === 0 && <div className={emptyClass}>No users found.</div>}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
type Tab = "objects" | "roles" | "users";

export default function SecurityAdminPage(): React.JSX.Element {
  const isEnabled = useObjectEnabled(ObjId.SECURITY);
  const canView = usePermission(ObjId.SECURITY, OpId.VIEW);
  const canEdit = usePermission(ObjId.SECURITY, OpId.EDIT);
  const canManage = usePermission(ObjId.SECURITY, OpId.MANAGE);
  const canMutate = canEdit || canManage;

  const [activeTab, setActiveTab] = useState<Tab>("objects");

  if (!isEnabled || !canView) return <AccessDenied />;

  return (
    <div className="p-5 md:p-8 md:px-10 max-w-300 mx-auto w-full text-foreground">
      <h1 className="m-0 text-2xl md:text-[28px] font-heading font-semibold text-heading tracking-tight mb-6">
        Security Admin
      </h1>

      <div
        className="flex gap-1 border-b border-border mb-6 overflow-x-auto scrollbar-hide"
        role="tablist"
      >
        {(["objects", "roles", "users"] as Tab[]).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            className={`py-2 px-4 border-none border-b-2 bg-transparent cursor-pointer text-sm font-medium transition-colors whitespace-nowrap shrink-0 -mb-px ${
              activeTab === tab
                ? "border-accent text-accent font-semibold"
                : "border-transparent text-foreground hover:text-heading hover:border-border"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div role="tabpanel">
        {activeTab === "objects" && <ObjectsTab canMutate={canMutate} />}
        {activeTab === "roles" && <RolesTab canMutate={canMutate} />}
        {activeTab === "users" && <UsersTab canMutate={canMutate} />}
      </div>
    </div>
  );
}
