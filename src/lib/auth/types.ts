// =============================================================================
// AUTH / RBAC TYPES — single source of truth for users, roles, permissions
// =============================================================================

export type Role =
  | 'super_admin'
  | 'ceo'
  | 'cfo'
  | 'finance_director'
  | 'director'
  | 'head_office'
  | 'manager'
  | 'principal'
  | 'accountant';

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  ceo: 'CEO',
  cfo: 'CFO',
  finance_director: 'Finance Director',
  director: 'Director',
  head_office: 'Head Office User',
  manager: 'Manager',
  principal: 'Principal',
  accountant: 'Accountant',
};

export const ALL_ROLES: Role[] = [
  'super_admin', 'ceo', 'cfo', 'finance_director',
  'director', 'head_office', 'manager', 'principal', 'accountant',
];

export type Permission =
  | 'view_dashboards'
  | 'view_all_companies'
  | 'manage_users'
  | 'manage_companies'
  | 'manage_settings'
  | 'perform_reconciliation'
  | 'review_reconciliation'
  | 'close_reconciliation'
  | 'unreconcile_transactions'
  | 'view_audit_trail'
  | 'manage_intercompany_mapping';

export const ALL_PERMISSIONS: Permission[] = [
  'view_dashboards',
  'view_all_companies',
  'manage_users',
  'manage_companies',
  'manage_settings',
  'perform_reconciliation',
  'review_reconciliation',
  'close_reconciliation',
  'unreconcile_transactions',
  'view_audit_trail',
  'manage_intercompany_mapping',
];

export const PERMISSION_LABELS: Record<Permission, string> = {
  view_dashboards: 'View Dashboards',
  view_all_companies: 'View All Companies',
  manage_users: 'Manage Users',
  manage_companies: 'Manage Companies',
  manage_settings: 'Manage Settings',
  perform_reconciliation: 'Perform Reconciliation',
  review_reconciliation: 'Review Reconciliation',
  close_reconciliation: 'Close Reconciliation',
  unreconcile_transactions: 'Unreconcile Transactions',
  view_audit_trail: 'View Audit Trail',
  manage_intercompany_mapping: 'Manage Inter-Company Mapping',
};

/** companies = '*' means access to all companies */
export type CompanyAccess = string[] | '*';

export interface AppUser {
  id: string;
  fullName: string;
  username: string;
  /** plaintext for the demo frontend-only auth (admin-managed) */
  password: string;
  role: Role;
  companies: CompanyAccess;
  active: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface Company {
  id: string;
  code: string;
  name: string;
  city: string;
  active: boolean;
  createdAt: string;
}

export type RolePermissions = Record<Role, Permission[]>;

export const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
  super_admin: [...ALL_PERMISSIONS],
  ceo: ['view_dashboards', 'view_all_companies', 'view_audit_trail'],
  cfo: ['view_dashboards', 'view_all_companies', 'view_audit_trail', 'review_reconciliation', 'close_reconciliation'],
  finance_director: [
    'view_dashboards', 'view_all_companies', 'view_audit_trail',
    'review_reconciliation', 'close_reconciliation', 'manage_intercompany_mapping',
  ],
  director: ['view_dashboards', 'view_audit_trail'],
  head_office: ['view_dashboards', 'view_audit_trail'],
  manager: ['view_dashboards', 'review_reconciliation'],
  principal: ['view_dashboards'],
  accountant: ['view_dashboards', 'perform_reconciliation'],
};
