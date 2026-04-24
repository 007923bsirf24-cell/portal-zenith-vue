import { AppUser, Permission, RolePermissions, DEFAULT_ROLE_PERMISSIONS } from './types';

export function hasPermission(
  user: AppUser | null,
  permission: Permission,
  rolePermissions: RolePermissions = DEFAULT_ROLE_PERMISSIONS,
): boolean {
  if (!user || !user.active) return false;
  if (user.role === 'super_admin') return true;
  return rolePermissions[user.role]?.includes(permission) ?? false;
}

export function canAccessCompany(user: AppUser | null, companyCode: string): boolean {
  if (!user || !user.active) return false;
  if (user.companies === '*') return true;
  return user.companies.includes(companyCode);
}

export const canViewAllCompanies = (u: AppUser | null) => u?.companies === '*';
export const canManageUsers       = (u: AppUser | null, rp?: RolePermissions) => hasPermission(u, 'manage_users', rp);
export const canManageCampuses    = (u: AppUser | null, rp?: RolePermissions) => hasPermission(u, 'manage_companies', rp);
export const canAccessSettings    = (u: AppUser | null, rp?: RolePermissions) => hasPermission(u, 'manage_settings', rp);
export const canPerformReconciliation = (u: AppUser | null, rp?: RolePermissions) => hasPermission(u, 'perform_reconciliation', rp);
export const canReviewReconciliation  = (u: AppUser | null, rp?: RolePermissions) => hasPermission(u, 'review_reconciliation', rp);
export const canCloseReconciliation   = (u: AppUser | null, rp?: RolePermissions) => hasPermission(u, 'close_reconciliation', rp);
export const canUnreconcile           = (u: AppUser | null, rp?: RolePermissions) => hasPermission(u, 'unreconcile_transactions', rp);
export const canManageIntercompanyMapping = (u: AppUser | null, rp?: RolePermissions) => hasPermission(u, 'manage_intercompany_mapping', rp);
export const canViewAuditTrail        = (u: AppUser | null, rp?: RolePermissions) => hasPermission(u, 'view_audit_trail', rp);

/** Returns the company codes a user may see, given the full company list */
export function visibleCompanyCodes(user: AppUser | null, allCompanyCodes: string[]): string[] {
  if (!user) return [];
  if (user.companies === '*') return allCompanyCodes;
  return allCompanyCodes.filter(c => (user.companies as string[]).includes(c));
}
