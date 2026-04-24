import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { AppUser, Company, RolePermissions, DEFAULT_ROLE_PERMISSIONS, Role } from '@/lib/auth/types';
import { SAMPLE_USERS, SAMPLE_COMPANIES } from '@/lib/auth/sampleData';
import { saveToStorage, loadFromStorage } from '@/lib/storage';
import { saveToCloud, loadFromCloud } from '@/lib/cloudStorage';

const KEYS = {
  USERS: 'frh-auth-users',
  COMPANIES: 'frh-auth-companies',
  PERMISSIONS: 'frh-auth-role-permissions',
  CURRENT: 'frh-auth-current-user-id',
  AUDIT: 'frh-auth-audit-trail',
};

export interface AuditEntry {
  id: string;
  action: string;
  userId: string;
  userName: string;
  userRole: Role | 'system';
  timestamp: string;
  details?: Record<string, unknown>;
}

interface AuthContextType {
  // session
  currentUser: AppUser | null;
  loading: boolean;
  login: (username: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;

  // users
  users: AppUser[];
  createUser: (u: Omit<AppUser, 'id' | 'createdAt' | 'lastLoginAt'>) => void;
  updateUser: (id: string, updates: Partial<AppUser>) => void;
  deleteUser: (id: string) => void;
  resetUserPassword: (id: string, newPassword: string) => void;

  // companies
  companies: Company[];
  createCompany: (c: Omit<Company, 'id' | 'createdAt'>) => void;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;

  // role permissions
  rolePermissions: RolePermissions;
  setRolePermissions: (rp: RolePermissions) => void;
  resetRolePermissions: () => void;

  // audit
  auditTrail: AuditEntry[];
  addAudit: (action: string, details?: Record<string, unknown>) => void;
  clearAudit: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function persist(key: string, value: unknown) {
  saveToStorage(key, value);
  saveToCloud(key, value);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<AppUser[]>(() => loadFromStorage(KEYS.USERS, SAMPLE_USERS));
  const [companies, setCompanies] = useState<Company[]>(() => loadFromStorage(KEYS.COMPANIES, SAMPLE_COMPANIES));
  const [rolePermissions, setRolePermissionsState] = useState<RolePermissions>(() =>
    loadFromStorage(KEYS.PERMISSIONS, DEFAULT_ROLE_PERMISSIONS)
  );
  const [currentUserId, setCurrentUserId] = useState<string | null>(() =>
    loadFromStorage<string | null>(KEYS.CURRENT, null)
  );
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>(() => loadFromStorage(KEYS.AUDIT, []));
  const [loading, setLoading] = useState(true);

  // hydrate from cloud once
  useEffect(() => {
    (async () => {
      const [cu, cc, cp, ct] = await Promise.all([
        loadFromCloud<AppUser[] | null>(KEYS.USERS, null),
        loadFromCloud<Company[] | null>(KEYS.COMPANIES, null),
        loadFromCloud<RolePermissions | null>(KEYS.PERMISSIONS, null),
        loadFromCloud<AuditEntry[] | null>(KEYS.AUDIT, null),
      ]);
      if (cu && cu.length) { setUsers(cu); saveToStorage(KEYS.USERS, cu); }
      else { saveToCloud(KEYS.USERS, users); }
      if (cc && cc.length) { setCompanies(cc); saveToStorage(KEYS.COMPANIES, cc); }
      else { saveToCloud(KEYS.COMPANIES, companies); }
      if (cp) { setRolePermissionsState(cp); saveToStorage(KEYS.PERMISSIONS, cp); }
      else { saveToCloud(KEYS.PERMISSIONS, rolePermissions); }
      if (ct) { setAuditTrail(ct); saveToStorage(KEYS.AUDIT, ct); }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentUser = useMemo(
    () => users.find(u => u.id === currentUserId) ?? null,
    [users, currentUserId]
  );

  const addAudit = useCallback((action: string, details?: Record<string, unknown>) => {
    setAuditTrail(prev => {
      const entry: AuditEntry = {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        action,
        userId: currentUserId ?? 'system',
        userName: users.find(u => u.id === currentUserId)?.fullName ?? 'System',
        userRole: users.find(u => u.id === currentUserId)?.role ?? 'system',
        timestamp: new Date().toISOString(),
        details,
      };
      const next = [entry, ...prev].slice(0, 1000);
      persist(KEYS.AUDIT, next);
      return next;
    });
  }, [currentUserId, users]);

  const login = useCallback((username: string, password: string) => {
    const u = users.find(x => x.username.toLowerCase() === username.trim().toLowerCase());
    if (!u) return { ok: false, error: 'User not found' };
    if (!u.active) return { ok: false, error: 'Account is inactive. Contact your administrator.' };
    if (u.password !== password) return { ok: false, error: 'Incorrect password' };

    const stamped = users.map(x => x.id === u.id ? { ...x, lastLoginAt: new Date().toISOString() } : x);
    setUsers(stamped);
    persist(KEYS.USERS, stamped);
    setCurrentUserId(u.id);
    persist(KEYS.CURRENT, u.id);
    // local audit so the login event captures the user
    setAuditTrail(prev => {
      const entry: AuditEntry = {
        id: `audit-${Date.now()}`,
        action: 'login',
        userId: u.id, userName: u.fullName, userRole: u.role,
        timestamp: new Date().toISOString(),
      };
      const next = [entry, ...prev].slice(0, 1000);
      persist(KEYS.AUDIT, next);
      return next;
    });
    return { ok: true };
  }, [users]);

  const logout = useCallback(() => {
    if (currentUser) addAudit('logout');
    setCurrentUserId(null);
    persist(KEYS.CURRENT, null);
  }, [currentUser, addAudit]);

  const createUser: AuthContextType['createUser'] = useCallback((u) => {
    const newUser: AppUser = {
      ...u,
      id: `u-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
    };
    setUsers(prev => {
      const next = [...prev, newUser];
      persist(KEYS.USERS, next);
      return next;
    });
    addAudit('user_created', { username: u.username, role: u.role });
  }, [addAudit]);

  const updateUser: AuthContextType['updateUser'] = useCallback((id, updates) => {
    setUsers(prev => {
      const next = prev.map(u => u.id === id ? { ...u, ...updates } : u);
      persist(KEYS.USERS, next);
      return next;
    });
    addAudit('user_updated', { id, updates: Object.keys(updates) });
  }, [addAudit]);

  const deleteUser: AuthContextType['deleteUser'] = useCallback((id) => {
    setUsers(prev => {
      const next = prev.filter(u => u.id !== id);
      persist(KEYS.USERS, next);
      return next;
    });
    addAudit('user_deleted', { id });
  }, [addAudit]);

  const resetUserPassword: AuthContextType['resetUserPassword'] = useCallback((id, newPassword) => {
    setUsers(prev => {
      const next = prev.map(u => u.id === id ? { ...u, password: newPassword } : u);
      persist(KEYS.USERS, next);
      return next;
    });
    addAudit('user_password_reset', { id });
  }, [addAudit]);

  const createCompany: AuthContextType['createCompany'] = useCallback((c) => {
    const company: Company = { ...c, id: `co-${Date.now()}`, createdAt: new Date().toISOString() };
    setCompanies(prev => {
      const next = [...prev, company];
      persist(KEYS.COMPANIES, next);
      return next;
    });
    addAudit('company_created', { code: c.code });
  }, [addAudit]);

  const updateCompany: AuthContextType['updateCompany'] = useCallback((id, updates) => {
    setCompanies(prev => {
      const next = prev.map(c => c.id === id ? { ...c, ...updates } : c);
      persist(KEYS.COMPANIES, next);
      return next;
    });
    addAudit('company_updated', { id });
  }, [addAudit]);

  const deleteCompany: AuthContextType['deleteCompany'] = useCallback((id) => {
    setCompanies(prev => {
      const next = prev.filter(c => c.id !== id);
      persist(KEYS.COMPANIES, next);
      return next;
    });
    addAudit('company_deleted', { id });
  }, [addAudit]);

  const setRolePermissions = useCallback((rp: RolePermissions) => {
    setRolePermissionsState(rp);
    persist(KEYS.PERMISSIONS, rp);
    addAudit('role_permissions_updated');
  }, [addAudit]);

  const resetRolePermissions = useCallback(() => {
    setRolePermissionsState(DEFAULT_ROLE_PERMISSIONS);
    persist(KEYS.PERMISSIONS, DEFAULT_ROLE_PERMISSIONS);
    addAudit('role_permissions_reset');
  }, [addAudit]);

  const clearAudit = useCallback(() => {
    setAuditTrail([]);
    persist(KEYS.AUDIT, []);
  }, []);

  const value: AuthContextType = {
    currentUser, loading, login, logout,
    users, createUser, updateUser, deleteUser, resetUserPassword,
    companies, createCompany, updateCompany, deleteCompany,
    rolePermissions, setRolePermissions, resetRolePermissions,
    auditTrail, addAudit, clearAudit,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
