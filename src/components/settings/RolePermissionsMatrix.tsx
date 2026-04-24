import { useAuth } from '@/contexts/AuthContext';
import { ALL_ROLES, ALL_PERMISSIONS, ROLE_LABELS, PERMISSION_LABELS, Role, Permission } from '@/lib/auth/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export function RolePermissionsMatrix() {
  const { rolePermissions, setRolePermissions, resetRolePermissions } = useAuth();

  const togglePerm = (role: Role, perm: Permission, on: boolean) => {
    const next = { ...rolePermissions };
    const current = new Set(next[role] ?? []);
    if (on) current.add(perm); else current.delete(perm);
    next[role] = [...current];
    setRolePermissions(next);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><ShieldCheck size={18} className="text-primary" /> Role permissions</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Super Admin always has full access. Changes apply immediately.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { resetRolePermissions(); toast.success('Reset to defaults'); }} className="gap-2">
          <RotateCcw size={14} /> Reset defaults
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left p-3 sticky left-0 bg-muted/40 z-10">Permission</th>
                {ALL_ROLES.map(r => (
                  <th key={r} className="p-3 text-center min-w-[110px]">
                    <div className="flex flex-col items-center gap-1">
                      <Badge variant="secondary" className="font-normal">{ROLE_LABELS[r]}</Badge>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_PERMISSIONS.map(perm => (
                <tr key={perm} className="border-t">
                  <td className="p-3 font-medium sticky left-0 bg-background z-10">{PERMISSION_LABELS[perm]}</td>
                  {ALL_ROLES.map(role => {
                    const isSuper = role === 'super_admin';
                    const checked = isSuper ? true : rolePermissions[role]?.includes(perm) ?? false;
                    return (
                      <td key={role} className="p-3 text-center">
                        <Checkbox
                          checked={checked}
                          disabled={isSuper}
                          onCheckedChange={(c) => togglePerm(role, perm, !!c)}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
