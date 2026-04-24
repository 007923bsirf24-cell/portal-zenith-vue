import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Company } from '@/lib/auth/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

export function CampusManagement() {
  const { companies, users, createCompany, updateCompany, deleteCompany } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editing, setEditing] = useState<Company | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    return companies.filter(c => {
      if (statusFilter === 'active' && !c.active) return false;
      if (statusFilter === 'inactive' && c.active) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.code.toLowerCase().includes(q) && !c.city.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [companies, search, statusFilter]);

  const assignedCount = (code: string) =>
    users.filter(u => u.companies === '*' || (u.companies as string[]).includes(code)).length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Campuses / Companies</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{companies.length} entities</p>
          </div>
          <Button onClick={() => setCreating(true)} className="gap-2"><Plus size={16} /> Add campus</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search code, name or city" className="pl-9" />
            </div>
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
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned users</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-xs">{c.code}</TableCell>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.city}</TableCell>
                    <TableCell><Badge variant={c.active ? 'default' : 'outline'}>{c.active ? 'Active' : 'Inactive'}</Badge></TableCell>
                    <TableCell><Badge variant="secondary">{assignedCount(c.code)}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setEditing(c)}><Pencil size={14} /></Button>
                        <Button
                          size="icon" variant="ghost"
                          onClick={() => {
                            if (confirm(`Delete "${c.name}"? This cannot be undone.`)) {
                              deleteCompany(c.id);
                              toast.success('Campus deleted');
                            }
                          }}
                        ><Trash2 size={14} className="text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No campuses</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {(creating || editing) && (
        <CampusDialog
          campus={editing ?? undefined}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSave={(payload) => {
            if (editing) { updateCompany(editing.id, payload); toast.success('Campus updated'); }
            else { createCompany(payload as Omit<Company, 'id' | 'createdAt'>); toast.success('Campus added'); }
            setCreating(false); setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function CampusDialog({ campus, onClose, onSave }: { campus?: Company; onClose: () => void; onSave: (c: Partial<Company>) => void }) {
  const [code, setCode] = useState(campus?.code ?? '');
  const [name, setName] = useState(campus?.name ?? '');
  const [city, setCity] = useState(campus?.city ?? '');
  const [active, setActive] = useState(campus?.active ?? true);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{campus ? 'Edit campus' : 'Add campus'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5"><Label>Company code</Label><Input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="QUETTA_BOYS" className="font-mono" /></div>
          <div className="space-y-1.5"><Label>Campus name</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>City / region</Label><Input value={city} onChange={e => setCity(e.target.value)} /></div>
          <div className="flex items-center gap-2 pt-2">
            <Switch checked={active} onCheckedChange={setActive} />
            <span className="text-sm">{active ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => {
            if (!code.trim() || !name.trim()) { toast.error('Code and name are required'); return; }
            onSave({ code, name, city, active });
          }}>{campus ? 'Save' : 'Add'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
