import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_LABELS } from '@/lib/auth/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Search, Download } from 'lucide-react';
import { toast } from 'sonner';

export function AuditTrailView() {
  const { auditTrail, clearAudit } = useAuth();
  const [search, setSearch] = useState('');

  const filtered = auditTrail.filter(e => {
    if (!search) return true;
    const q = search.toLowerCase();
    return e.action.toLowerCase().includes(q)
      || e.userName.toLowerCase().includes(q)
      || JSON.stringify(e.details ?? {}).toLowerCase().includes(q);
  });

  const exportCsv = () => {
    const rows = [['Timestamp','Action','User','Role','Details']];
    for (const e of filtered) {
      rows.push([
        new Date(e.timestamp).toISOString(),
        e.action,
        e.userName,
        e.userRole === 'system' ? 'System' : ROLE_LABELS[e.userRole],
        JSON.stringify(e.details ?? {}),
      ]);
    }
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `audit-trail-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Audit Trail</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{auditTrail.length} events recorded</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCsv} className="gap-2"><Download size={14} /> Export</Button>
          <Button variant="outline" size="sm" onClick={() => { if (confirm('Clear audit trail?')) { clearAudit(); toast.success('Cleared'); } }} className="gap-2 text-destructive">
            <Trash2 size={14} /> Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search action, user, or details" className="pl-9" />
        </div>
        <div className="border rounded-lg overflow-x-auto max-h-[600px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(e => (
                <TableRow key={e.id}>
                  <TableCell className="text-xs text-muted-foreground">{new Date(e.timestamp).toLocaleString()}</TableCell>
                  <TableCell><Badge variant="secondary">{e.action}</Badge></TableCell>
                  <TableCell className="text-sm">{e.userName}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {e.userRole === 'system' ? 'System' : ROLE_LABELS[e.userRole]}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground max-w-[300px] truncate">
                    {e.details ? JSON.stringify(e.details) : '—'}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No events</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
