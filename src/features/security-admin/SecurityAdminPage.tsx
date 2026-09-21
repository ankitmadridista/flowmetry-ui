import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useObjectEnabled, usePermission } from '../auth/usePermissions';
import { ObjId, OpId, PERMISSION_MAP } from '../auth/permissions';
import {
  getSecurityObjects,
  patchSecurityObject,
  getRoles,
  addPermissionToRole,
  removePermissionFromRole,
  getUsers,
  addRoleToUser,
  removeRoleFromUser,
} from './security-admin.api';
import type { SecurityObjectDto, RoleWithPermissionsDto, UserWithRolesDto } from './security-admin.api';
import './security-admin.css';
import '../invoices/invoices.css';

// ── AccessDenied ──────────────────────────────────────────────────────────────
function AccessDenied() {
  const navigate = useNavigate();
  return (
    <div className="access-denied">
      <span className="access-denied-icon">🔒</span>
      <h2>Access Restricted</h2>
      <p>You don't have permission to view this page.</p>
      <button className="btn-primary" onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}

// ── Static permission label map ───────────────────────────────────────────────
const PERMISSION_LABELS: Record<number, string> = {
  1:  'Dashboard – View',   2:  'Dashboard – Create',
  3:  'Dashboard – Edit',   4:  'Dashboard – Delete',
  5:  'Invoices – View',    6:  'Invoices – Create',
  7:  'Invoices – Edit',    8:  'Invoices – Delete',
  9:  'Customers – View',   10: 'Customers – Create',
  11: 'Customers – Edit',   12: 'Customers – Delete',
  13: 'Payments – View',    14: 'Payments – Create',
  15: 'Payments – Edit',    16: 'Payments – Delete',
  17: 'Reports – View',     18: 'Reports – Create',
  19: 'Reports – Edit',     20: 'Reports – Delete',
  21: 'Security – View',    22: 'Security – Edit',
  23: 'Security – Manage',
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
      .then(data => { if (!cancelled) setObjects(data); })
      .catch(err => { if (!cancelled) setError((err as Error).message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  async function handleToggle(item: SecurityObjectDto) {
    const prev = objects;
    setObjects(objs => objs.map(o => o.id === item.id ? { ...o, isEnabled: !o.isEnabled } : o));
    setRowError(e => ({ ...e, [item.id]: '' }));
    try {
      const updated = await patchSecurityObject(item.id, !item.isEnabled);
      setObjects(objs => objs.map(o => o.id === updated.id ? updated : o));
    } catch (err) {
      setObjects(prev);
      setRowError(e => ({ ...e, [item.id]: (err as Error).message }));
    }
  }

  if (loading) return <div className="security-empty">Loading…</div>;
  if (error) return <p className="error-state" role="alert">{error}</p>;

  const roots = objects.filter(o => o.parentId === null);
  const children = objects.filter(o => o.parentId !== null);

  const rows: Array<{ item: SecurityObjectDto; indent: boolean }> = [];
  for (const root of roots) {
    rows.push({ item: root, indent: false });
    for (const child of children.filter(c => c.parentId === root.id)) {
      rows.push({ item: child, indent: true });
    }
  }
  for (const child of children.filter(c => !roots.some(r => r.id === c.parentId))) {
    rows.push({ item: child, indent: false });
  }

  return (
    <div className="security-card">
      {rows.map(({ item, indent }) => {
        const showToggle = canMutate && item.id !== 7;
        return (
          <div key={item.id} className={`security-row${indent ? ' indent' : ''}`}>
            <span className={`security-row-title${indent ? '' : ' parent'}`}>{item.title}</span>
            <span className={`security-badge ${item.isEnabled ? 'enabled' : 'disabled'}`}>
              {item.isEnabled ? 'Enabled' : 'Disabled'}
            </span>
            {showToggle && (
              <button
                className="btn-primary"
                style={{ height: '28px', padding: '0 12px', fontSize: '12px' }}
                onClick={() => handleToggle(item)}
                aria-label={`${item.isEnabled ? 'Disable' : 'Enable'} ${item.title}`}
              >
                {item.isEnabled ? 'Disable' : 'Enable'}
              </button>
            )}
            {rowError[item.id] && (
              <span className="security-row-error">{rowError[item.id]}</span>
            )}
          </div>
        );
      })}
      {rows.length === 0 && <div className="security-empty">No objects found.</div>}
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
      .then(data => { if (!cancelled) setRoles(data); })
      .catch(err => { if (!cancelled) setError((err as Error).message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  async function handleAddPermission(role: RoleWithPermissionsDto) {
    const permId = selectedPerm[role.id];
    if (!permId) return;
    const prev = roles;
    setRoles(rs => rs.map(r => r.id === role.id ? { ...r, permissionIds: [...new Set([...r.permissionIds, permId])] } : r));
    setRowError(e => ({ ...e, [role.id]: '' }));
    try {
      const updated = await addPermissionToRole(role.id, permId);
      setRoles(rs => rs.map(r => r.id === updated.id ? updated : r));
    } catch (err) {
      setRoles(prev);
      setRowError(e => ({ ...e, [role.id]: (err as Error).message }));
    }
  }

  async function handleRemovePermission(role: RoleWithPermissionsDto, permId: number) {
    const prev = roles;
    setRoles(rs => rs.map(r => r.id === role.id ? { ...r, permissionIds: r.permissionIds.filter(p => p !== permId) } : r));
    setRowError(e => ({ ...e, [role.id]: '' }));
    try {
      const updated = await removePermissionFromRole(role.id, permId);
      setRoles(rs => rs.map(r => r.id === updated.id ? updated : r));
    } catch (err) {
      setRoles(prev);
      setRowError(e => ({ ...e, [role.id]: (err as Error).message }));
    }
  }

  if (loading) return <div className="security-empty">Loading…</div>;
  if (error) return <p className="error-state" role="alert">{error}</p>;

  return (
    <div className="security-card">
      {roles.map(role => {
        const availablePerms = ALL_PERMISSION_IDS.filter(id => !role.permissionIds.includes(id));
        return (
          <div key={role.id} className="security-entity-row">
            <div className="security-entity-name">{role.roleName}</div>
            <div className="security-tags">
              {role.permissionIds.length === 0 && (
                <span style={{ fontSize: '12px', color: 'var(--text)', opacity: 0.6 }}>No permissions</span>
              )}
              {role.permissionIds.map(pid => (
                <span key={pid} className="security-tag">
                  {PERMISSION_LABELS[pid] ?? `Permission ${pid}`}
                  {canMutate && (
                    <button
                      className="security-tag-remove"
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
              <div className="security-add-row">
                <select
                  className="security-select"
                  value={selectedPerm[role.id] ?? ''}
                  onChange={e => setSelectedPerm(s => ({ ...s, [role.id]: Number(e.target.value) }))}
                  aria-label={`Select permission to add to ${role.roleName}`}
                >
                  <option value="">Add permission…</option>
                  {availablePerms.map(pid => (
                    <option key={pid} value={pid}>{PERMISSION_LABELS[pid] ?? `Permission ${pid}`}</option>
                  ))}
                </select>
                <button
                  className="btn-primary"
                  style={{ height: '32px', padding: '0 14px', fontSize: '13px' }}
                  onClick={() => handleAddPermission(role)}
                  disabled={!selectedPerm[role.id]}
                  aria-label={`Add selected permission to ${role.roleName}`}
                >
                  Add
                </button>
              </div>
            )}
            {rowError[role.id] && <p className="security-row-error">{rowError[role.id]}</p>}
          </div>
        );
      })}
      {roles.length === 0 && <div className="security-empty">No roles found.</div>}
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
      .then(([u, r]) => { if (!cancelled) { setUsers(u); setRoles(r); } })
      .catch(err => { if (!cancelled) setError((err as Error).message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  function roleName(roleId: number): string {
    return roles.find(r => r.id === roleId)?.roleName ?? `Role ${roleId}`;
  }

  async function handleAddRole(user: UserWithRolesDto) {
    const roleId = selectedRole[user.userId];
    if (!roleId) return;
    const prev = users;
    setUsers(us => us.map(u => u.userId === user.userId ? { ...u, roleIds: [...new Set([...u.roleIds, roleId])] } : u));
    setRowError(e => ({ ...e, [user.userId]: '' }));
    try {
      const updated = await addRoleToUser(user.userId, roleId);
      setUsers(us => us.map(u => u.userId === updated.userId ? updated : u));
    } catch (err) {
      setUsers(prev);
      setRowError(e => ({ ...e, [user.userId]: (err as Error).message }));
    }
  }

  async function handleRemoveRole(user: UserWithRolesDto, roleId: number) {
    const prev = users;
    setUsers(us => us.map(u => u.userId === user.userId ? { ...u, roleIds: u.roleIds.filter(r => r !== roleId) } : u));
    setRowError(e => ({ ...e, [user.userId]: '' }));
    try {
      const updated = await removeRoleFromUser(user.userId, roleId);
      setUsers(us => us.map(u => u.userId === updated.userId ? updated : u));
    } catch (err) {
      setUsers(prev);
      setRowError(e => ({ ...e, [user.userId]: (err as Error).message }));
    }
  }

  if (loading) return <div className="security-empty">Loading…</div>;
  if (error) return <p className="error-state" role="alert">{error}</p>;

  return (
    <div className="security-card">
      {users.map(user => {
        const availableRoles = roles.filter(r => !user.roleIds.includes(r.id));
        const displayName = user.displayName || user.email;
        return (
          <div key={user.userId} className="security-entity-row">
            <div className="security-entity-name">{displayName}</div>
            <div className="security-tags">
              {user.roleIds.length === 0 && (
                <span style={{ fontSize: '12px', color: 'var(--text)', opacity: 0.6 }}>No roles</span>
              )}
              {user.roleIds.map(rid => (
                <span key={rid} className="security-tag">
                  {roleName(rid)}
                  {canMutate && (
                    <button
                      className="security-tag-remove"
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
              <div className="security-add-row">
                <select
                  className="security-select"
                  value={selectedRole[user.userId] ?? ''}
                  onChange={e => setSelectedRole(s => ({ ...s, [user.userId]: Number(e.target.value) }))}
                  aria-label={`Select role to add to ${displayName}`}
                >
                  <option value="">Add role…</option>
                  {availableRoles.map(r => (
                    <option key={r.id} value={r.id}>{r.roleName}</option>
                  ))}
                </select>
                <button
                  className="btn-primary"
                  style={{ height: '32px', padding: '0 14px', fontSize: '13px' }}
                  onClick={() => handleAddRole(user)}
                  disabled={!selectedRole[user.userId]}
                  aria-label={`Add selected role to ${displayName}`}
                >
                  Add
                </button>
              </div>
            )}
            {rowError[user.userId] && <p className="security-row-error">{rowError[user.userId]}</p>}
          </div>
        );
      })}
      {users.length === 0 && <div className="security-empty">No users found.</div>}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
type Tab = 'objects' | 'roles' | 'users';

export default function SecurityAdminPage(): React.JSX.Element {
  const isEnabled = useObjectEnabled(ObjId.SECURITY);
  const canView   = usePermission(ObjId.SECURITY, OpId.VIEW);
  const canMutate = usePermission(ObjId.SECURITY, OpId.EDIT) || usePermission(ObjId.SECURITY, OpId.MANAGE);

  const [activeTab, setActiveTab] = useState<Tab>('objects');

  if (!isEnabled || !canView) return <AccessDenied />;

  return (
    <div className="security-page">
      <h1>Security Admin</h1>

      <div className="security-tab-bar" role="tablist">
        {(['objects', 'roles', 'users'] as Tab[]).map(tab => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            className={`security-tab-btn${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div role="tabpanel">
        {activeTab === 'objects' && <ObjectsTab canMutate={canMutate} />}
        {activeTab === 'roles'   && <RolesTab   canMutate={canMutate} />}
        {activeTab === 'users'   && <UsersTab   canMutate={canMutate} />}
      </div>
    </div>
  );
}
