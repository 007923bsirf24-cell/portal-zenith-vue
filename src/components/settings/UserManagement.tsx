import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppUser, Role, ALL_ROLES, ROLE_LABELS, CompanyAccess } from '@/lib/auth/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, KeyRound, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

const ALL_COMPANIES = '__ALL__';

export function UserManagement() {
  const { users, companies, createUser, updateUser, deleteUser, resetUserPassword, currentUser } = useAuth();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [editing, setEditing] = useState<AppUser | null>(null);
  const [creating, setCreating] = useState(false);
  const [resetFor, setResetFor] = useState<AppUser | null>(null);

  const filtered = useMemo(() => {
    return users.filter(u => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (statusFilter === 'active' && !u.active) return false;
      if (statusFilter === 'inactive' && u.active) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!u.fullName.toLowerCase().includes(q) && !u.username.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [users, search, roleFilter, statusFilter]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Users</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{users.length} accounts</p>
          </div>
          <Button onClick={() => setCreating(true)} className="gap-2">
            <Plus size={16} /> Add user
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or username" className="pl-9" />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                {ALL_ROLES.map(r => <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Companies</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(u => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.fullName}</TableCell>
                    <TableCell className="font-mono text-xs">{u.username}</TableCell>
                    <TableCell><Badge variant="secondary">{ROLE_LABELS[u.role]}</Badge></TableCell>
                    <TableCell className="text-xs">
                      {u.companies === '*'
                        ? <Badge>All companies</Badge>
                        : <span className="text-muted-foreground">{u.companies.length} assigned</span>}
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.active ? 'default' : 'outline'}>
                        {u.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setResetFor(u)} title="Reset password">
                          <KeyRound size={14} />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setEditing(u)} title="Edit">
                          <Pencil size={14} />
                        </Button>
                        <Button
                          size="icon" variant="ghost"
                          disabled={u.id === currentUser?.id}
                          onClick={() => {
                            if (confirm(`Delete user "${u.fullName}"?`)) {
                              deleteUser(u.id);
                              toast.success('User deleted');
                            }
                          }}
                          title="Delete"
                        >
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No users</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {(creating || editing) && (
        <UserDialog
          user={editing ?? undefined}
          companies={companies.map(c => c.code)}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSave={(payload) => {
            if (editing) {
              updateUser(editing.id, payload);
              toast.success('User updated');
            } else {
              createUser(payload as Omit<AppUser, 'id' | 'createdAt' | 'lastLoginAt'>);
              toast.success('User created');
            }
            setCreating(false); setEditing(null);
          }}
        />
      )}

      {resetFor && (
        <ResetPasswordDialog
          user={resetFor}
          onClose={() => setResetFor(null)}
          onReset={(pwd) => { resetUserPassword(resetFor.id, pwd); toast.success('Password reset'); setResetFor(null); }}
        />
      )}
    </div>
  );
}

// ---------- Sub-dialogs ----------

function UserDialog({
  user, companies, onClose, onSave,
}: {
  user?: AppUser;
  companies: string[];
  onClose: () => void;
  onSave: (u: Partial<AppUser>) => void;
}) {
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [username, setUsername] = useState(user?.username ?? '');
  const [password, setPassword] = useState(user ? '' : '');
  const [role, setRole] = useState<Role>(user?.role ?? 'accountant');
  const [active, setActive] = useState(user?.active ?? true);
  const [allCompanies, setAllCompanies] = useState(user?.companies === '*');
  const [selected, setSelected] = useState<string[]>(user?.companies === '*' ? [] : (user?.companies as string[] ?? []));

  const handleSubmit = () => {
    if (!fullName.trim() || !username.trim()) { toast.error('Name and username are required'); return; }
    if (!user && !password.trim()) { toast.error('Password is required'); return; }
    const access: CompanyAccess = allCompanies ? '*' : selected;
    const payload: Partial<AppUser> = { fullName, username, role, active, companies: access };
    if (password.trim()) payload.password = password;
    onSave(payload);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit user' : 'Create user'}</DialogTitle>
          <DialogDescription>
            {user ? 'Update details. Leave password blank to keep it unchanged.' : 'Set username, password, role, and company access.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5"><Label>Full name</Label><Input value={fullName} onChange={e => setFullName(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Username</Label><Input value={username} onChange={e => setUsername(e.target.value)} /></div>
            <div className="space-y-1.5">
              <Label>{user ? 'New password (optional)' : 'Password'}</Label>
              <Input type="text" value={password} onChange={e => setPassword(e.target.value)} placeholder={user ? 'Leave blank to keep' : ''} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{ALL_ROLES.map(r => <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <div className="flex items-center gap-2 h-10 px-3 border rounded-md">
                <Switch checked={active} onCheckedChange={setActive} />
                <span className="text-sm">{active ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t pt-3">
            <div className="flex items-center justify-between">
              <Label>Company access</Label>
              <div className="flex items-center gap-2">
                <Switch checked={allCompanies} onCheckedChange={setAllCompanies} />
                <span className="text-sm">All companies</span>
              </div>
            </div>
            {!allCompanies && (
              <div className="border rounded-md max-h-56 overflow-y-auto p-2 space-y-1">
                {companies.map(code => (
                  <label key={code} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer">
                    <Checkbox
                      checked={selected.includes(code)}
                      onCheckedChange={(checked) => {
                        setSelected(prev => checked ? [...prev, code] : prev.filter(c => c !== code));
                      }}
                    />
                    <span className="font-mono text-xs">{code}</span>
                  </label>
                ))}
              </div>
            )}
            {!allCompanies && (
              <p className="text-xs text-muted-foreground">{selected.length} selected</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{user ? 'Save changes' : 'Create user'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ResetPasswordDialog({ user, onClose, onReset }: { user: AppUser; onClose: () => void; onReset: (p: string) => void }) {
  const [pwd, setPwd] = useState('');
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Reset password</DialogTitle>
          <DialogDescription>Set a new password for <span className="font-medium text-foreground">{user.fullName}</span>.</DialogDescription>
        </DialogHeader>
        <Input value={pwd} onChange={e => setPwd(e.target.value)} placeholder="New password" />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => pwd.trim() ? onReset(pwd) : toast.error('Password cannot be empty')}>Reset</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
