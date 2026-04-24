import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Image, LayoutDashboard, Download, Home, Users, Building2, ShieldCheck, ScrollText } from 'lucide-react';
import { BrandingSettings } from '@/components/settings/BrandingSettings';
import { ThemeSettings } from '@/components/settings/ThemeSettings';
import { DashboardManager } from '@/components/settings/DashboardManager';
import { ImportExportSettings } from '@/components/settings/ImportExportSettings';
import { CoverPageSettings } from '@/components/settings/CoverPageSettings';
import { UserManagement } from '@/components/settings/UserManagement';
import { CampusManagement } from '@/components/settings/CampusManagement';
import { RolePermissionsMatrix } from '@/components/settings/RolePermissionsMatrix';
import { AuditTrailView } from '@/components/settings/AuditTrailView';
import { useAuth } from '@/contexts/AuthContext';
import { canManageUsers, canManageCampuses, canViewAuditTrail } from '@/lib/auth/permissions';

const Settings = () => {
  const { currentUser, rolePermissions } = useAuth();
  const canUsers = canManageUsers(currentUser, rolePermissions);
  const canCampuses = canManageCampuses(currentUser, rolePermissions);
  const canAudit = canViewAuditTrail(currentUser, rolePermissions);
  const canRolePerms = currentUser?.role === 'super_admin';

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage users, campuses, permissions, branding, and dashboards</p>
      </div>

      <Tabs defaultValue={canUsers ? 'users' : 'cover'} className="space-y-6">
        <TabsList className="bg-muted rounded-xl p-1 h-auto flex-wrap">
          {canUsers && (
            <TabsTrigger value="users" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Users size={15} /> Users
            </TabsTrigger>
          )}
          {canCampuses && (
            <TabsTrigger value="campuses" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Building2 size={15} /> Campuses
            </TabsTrigger>
          )}
          {canRolePerms && (
            <TabsTrigger value="permissions" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <ShieldCheck size={15} /> Permissions
            </TabsTrigger>
          )}
          {canAudit && (
            <TabsTrigger value="audit" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <ScrollText size={15} /> Audit Trail
            </TabsTrigger>
          )}
          <TabsTrigger value="cover" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Home size={15} /> Cover Page
          </TabsTrigger>
          <TabsTrigger value="branding" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Image size={15} /> Branding
          </TabsTrigger>
          <TabsTrigger value="theme" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Palette size={15} /> Theme
          </TabsTrigger>
          <TabsTrigger value="dashboards" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <LayoutDashboard size={15} /> Dashboards
          </TabsTrigger>
          <TabsTrigger value="import-export" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Download size={15} /> Import / Export
          </TabsTrigger>
        </TabsList>

        {canUsers && <TabsContent value="users"><UserManagement /></TabsContent>}
        {canCampuses && <TabsContent value="campuses"><CampusManagement /></TabsContent>}
        {canRolePerms && <TabsContent value="permissions"><RolePermissionsMatrix /></TabsContent>}
        {canAudit && <TabsContent value="audit"><AuditTrailView /></TabsContent>}
        <TabsContent value="cover"><CoverPageSettings /></TabsContent>
        <TabsContent value="branding"><BrandingSettings /></TabsContent>
        <TabsContent value="theme"><ThemeSettings /></TabsContent>
        <TabsContent value="dashboards"><DashboardManager /></TabsContent>
        <TabsContent value="import-export"><ImportExportSettings /></TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
