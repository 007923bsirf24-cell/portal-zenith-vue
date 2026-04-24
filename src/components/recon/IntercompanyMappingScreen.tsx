import { useMemo, useState } from 'react';
import { useRecon } from '@/contexts/ReconContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Search, Link2, RefreshCw, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { IntercompanyMapping } from '@/lib/recon/types';

export function IntercompanyMappingScreen() {
  const { mappings, chartOfAccounts, updateMapping, addManualMapping, resetMappings } = useRecon();
  const { companies } = useAuth();
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [showOnlyMapped, setShowOnlyMapped] = useState(false);

  const companyCodes = useMemo(() => companies.map(c => c.code), [companies]);

  // Combined view: detected/mapped + remaining CoA rows so admin can manually flag
  const rows = useMemo(() => {
    const mappedKeys = new Set(mappings.map(m => m.id));
    const all: Array<IntercompanyMapping & { _isMapped: boolean }> = mappings.map(m => ({ ...m, _isMapped: true }));

    if (!showOnlyMapped) {
      for (const a of chartOfAccounts) {
        const key = `${a.Company}::${a.AcctCode}`;
        if (mappedKeys.has(key)) continue;
        all.push({
          id: key, company: a.Company, acctCode: a.AcctCode, acctName: a.AcctName,
          fatherNum: a.FatherNum, levels: a.Levels, postable: a.Postable,
          linkedCompany: null, accountType: 'other', active: false,
          manualOverride: false, updatedAt: '', _isMapped: false,
        });
      }
    }

    return all
      .filter(r => companyFilter === 'all' ? true : r.company === companyFilter)
      .filter(r => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return r.acctName.toLowerCase().includes(q)
          || r.acctCode.toLowerCase().includes(q)
          || r.company.toLowerCase().includes(q);
      })
      .sort((a, b) => Number(b._isMapped) - Number(a._isMapped) || a.company.localeCompare(b.company) || a.acctCode.localeCompare(b.acctCode));
  }, [mappings, chartOfAccounts, search, companyFilter, showOnlyMapped]);

  const detectedCount = mappings.length;
  const linkedCount = mappings.filter(m => m.linkedCompany).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-4">
          <div className="text-xs text-muted-foreground">Total CoA rows</div>
          <div className="text-2xl font-bold mt-1">{chartOfAccounts.length}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="text-xs text-muted-foreground">Detected intercompany</div>
          <div className="text-2xl font-bold mt-1 text-primary">{detectedCount}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="text-xs text-muted-foreground">Linked to counterpart</div>
          <div className="text-2xl font-bold mt-1">{linkedCount}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="text-xs text-muted-foreground">Companies covered</div>
          <div className="text-2xl font-bold mt-1">{new Set(mappings.map(m => m.company)).size}</div>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <CardTitle className="flex items-center gap-2"><Link2 size={18} className="text-primary" /> Inter-Company Account Mapping</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Detect and link inter-company accounts across the chart of accounts. Detection rule:
                account name contains "Inter Company" or parent = <code className="text-xs bg-muted px-1 rounded">21300000</code>.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => { resetMappings(); toast.success('Manual overrides cleared'); }}>
              <RefreshCw size={14} className="mr-1.5" /> Reset overrides
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <div className="relative flex-1 min-w-[220px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search account name, code, company…" className="pl-9 h-9" />
            </div>
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-[220px] h-9"><SelectValue placeholder="Company" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All companies</SelectItem>
                {companies.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={showOnlyMapped} onCheckedChange={setShowOnlyMapped} />
              Show only intercompany
            </label>
          </div>

          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Company</TableHead>
                  <TableHead>AcctCode</TableHead>
                  <TableHead className="min-w-[260px]">AcctName</TableHead>
                  <TableHead>FatherNum</TableHead>
                  <TableHead>Linked Counterpart</TableHead>
                  <TableHead>Account Type</TableHead>
                  <TableHead>Intercompany</TableHead>
                  <TableHead>Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 && (
                  <TableRow><TableCell colSpan={8} className="text-center py-10 text-muted-foreground">No accounts found.</TableCell></TableRow>
                )}
                {rows.slice(0, 500).map(r => {
                  const setOverride = (patch: Partial<IntercompanyMapping>) => {
                    if (r._isMapped) updateMapping(r.id, patch);
                    else addManualMapping({ ...r, ...patch, manualOverride: true, updatedAt: new Date().toISOString() });
                  };
                  return (
                    <TableRow key={r.id} className={r._isMapped ? '' : 'opacity-70'}>
                      <TableCell className="font-mono text-xs">{r.company}</TableCell>
                      <TableCell className="font-mono text-xs">{r.acctCode}</TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-2">
                          {r.acctName}
                          {r.manualOverride && <Badge variant="outline" className="text-[10px]"><Wand2 size={10} className="mr-1" />manual</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{r.fatherNum}</TableCell>
                      <TableCell>
                        <Select
                          value={r.linkedCompany ?? 'none'}
                          onValueChange={(v) => setOverride({ linkedCompany: v === 'none' ? null : v })}
                        >
                          <SelectTrigger className="h-8 w-[200px] text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">— not linked —</SelectItem>
                            {companyCodes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={r.accountType}
                          onValueChange={(v: IntercompanyMapping['accountType']) => setOverride({ accountType: v })}
                        >
                          <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="head_office">Head Office</SelectItem>
                            <SelectItem value="campus">Campus</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={r._isMapped || r.manualOverride}
                          onCheckedChange={(v) => setOverride({ manualOverride: v })}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={r.active}
                          onCheckedChange={(v) => setOverride({ active: v })}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {rows.length > 500 && (
            <p className="text-xs text-muted-foreground mt-2">Showing first 500 of {rows.length}. Use search to narrow down.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
