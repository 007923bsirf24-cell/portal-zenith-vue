import { useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRecon } from '@/contexts/ReconContext';
import {
  canPerformReconciliation, canReviewReconciliation, canCloseReconciliation,
  canUnreconcile, canManageIntercompanyMapping, visibleCompanyCodes,
} from '@/lib/auth/permissions';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { LedgerTable } from '@/components/recon/LedgerTable';
import { SummaryCards, SummaryStat } from '@/components/recon/SummaryCards';
import { StatusBadge } from '@/components/recon/StatusBadge';
import { IntercompanyMappingScreen } from '@/components/recon/IntercompanyMappingScreen';
import { buildSuggestions, classifyManual } from '@/lib/recon/matching';
import { GeneralLedgerRow, PERIOD_STATUS_LABELS, PeriodStatus } from '@/lib/recon/types';
import { toast } from 'sonner';
import {
  CheckCircle2, AlertCircle, Search, Lock, Send, RotateCcw,
  ClipboardCheck, Sparkles, Download, ScrollText, BarChart3, FileSpreadsheet,
} from 'lucide-react';

const HO_DEFAULT = 'TMF_HO_OB';

const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const monthOf = (iso: string) => iso.slice(0, 7);

export default function IntercompanyReconciliation() {
  const { currentUser, companies, rolePermissions } = useAuth();
  const {
    chartOfAccounts, generalLedger, mappings,
    periods, getOrCreatePeriod, setPeriodStatus,
    reconciledLines, reconcilePair, unreconcile, updateRemarks,
    auditTrail,
  } = useRecon();

  // -------- permissions
  const canDo = canPerformReconciliation(currentUser, rolePermissions);
  const canReview = canReviewReconciliation(currentUser, rolePermissions);
  const canClose = canCloseReconciliation(currentUser, rolePermissions);
  const canUndo = canUnreconcile(currentUser, rolePermissions);
  const canManageMapping = canManageIntercompanyMapping(currentUser, rolePermissions);

  // -------- visible companies
  const allCompanyCodes = companies.map(c => c.code);
  const visibleCodes = useMemo(
    () => visibleCompanyCodes(currentUser, allCompanyCodes),
    [currentUser, allCompanyCodes.join(',')],  // eslint-disable-line react-hooks/exhaustive-deps
  );
  const campusOptions = companies.filter(c => c.code !== HO_DEFAULT && visibleCodes.includes(c.code));

  // -------- filters
  const monthOptions = useMemo(() => {
    const m = new Set<string>();
    for (const r of generalLedger) m.add(monthOf(r.PostingDate));
    return Array.from(m).sort().reverse();
  }, [generalLedger]);

  const [campus, setCampus] = useState<string>(campusOptions[0]?.code ?? '');
  const [periodMonth, setPeriodMonth] = useState<string>(monthOptions[0] ?? '');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reconciled'>('all');

  const [hoSelected, setHoSelected] = useState<string | null>(null);
  const [campusSelected, setCampusSelected] = useState<string | null>(null);
  const [remarksOpen, setRemarksOpen] = useState(false);
  const [remarks, setRemarks] = useState('');

  // -------- reference lookup
  const acctNameLookup = (code: string, company: string) =>
    chartOfAccounts.find(a => a.Company === company && a.AcctCode === code)?.AcctName ?? code;

  const intercompanyAccountKeys = useMemo(() => {
    const set = new Set<string>();
    for (const m of mappings) {
      if (m.active !== false) set.add(`${m.company}::${m.acctCode}`);
    }
    return set;
  }, [mappings]);

  // -------- filter ledger
  const baseLedger = useMemo(() => {
    return generalLedger.filter(r => intercompanyAccountKeys.has(`${r.Company}::${r.AccountCode}`));
  }, [generalLedger, intercompanyAccountKeys]);

  const period = useMemo(() => {
    if (!campus || !periodMonth || !currentUser) return null;
    return getOrCreatePeriod(HO_DEFAULT, campus, periodMonth);
  }, [campus, periodMonth, currentUser, getOrCreatePeriod]);

  const periodLines = useMemo(
    () => reconciledLines.filter(l => l.reconciliationPeriodId === period?.id),
    [reconciledLines, period],
  );
  const reconciledIds = useMemo(() => {
    const s = new Set<string>();
    for (const l of periodLines) { s.add(l.hoLedgerId); s.add(l.campusLedgerId); }
    return s;
  }, [periodLines]);

  const hoRows = useMemo(() => baseLedger
    .filter(r => r.Company === HO_DEFAULT)
    .filter(r => monthOf(r.PostingDate) === periodMonth)
    .filter(r => {
      // HO row should reference the selected campus (via the linked mapping)
      const m = mappings.find(x => x.company === HO_DEFAULT && x.acctCode === r.AccountCode);
      return m?.linkedCompany === campus;
    })
    .filter(searchFilter(search))
    .filter(statusGate(statusFilter, reconciledIds)),
    [baseLedger, periodMonth, campus, mappings, search, statusFilter, reconciledIds],
  );

  const campusRows = useMemo(() => baseLedger
    .filter(r => r.Company === campus)
    .filter(r => monthOf(r.PostingDate) === periodMonth)
    .filter(searchFilter(search))
    .filter(statusGate(statusFilter, reconciledIds)),
    [baseLedger, periodMonth, campus, search, statusFilter, reconciledIds],
  );

  const suggestions = useMemo(
    () => buildSuggestions(hoRows, campusRows, reconciledIds),
    [hoRows, campusRows, reconciledIds],
  );
  const suggestedIds = useMemo(() => {
    const s = new Set<string>();
    for (const sug of suggestions) { s.add(sug.hoRow.id); s.add(sug.campusRow.id); }
    return s;
  }, [suggestions]);

  // -------- summary
  const stats: SummaryStat[] = useMemo(() => {
    const allHo = hoRows.concat(periodLines.map(l => ({ id: l.hoLedgerId } as any)));
    const allCampus = campusRows.concat(periodLines.map(l => ({ id: l.campusLedgerId } as any)));
    const sum = (arr: GeneralLedgerRow[], k: 'Debit' | 'Credit' | 'Net') => arr.reduce((a, r) => a + r[k], 0);
    const totalItems = hoRows.length + campusRows.length + periodLines.length * 2;
    const reconciledItems = periodLines.length * 2;
    const completion = totalItems === 0 ? 0 : Math.round((reconciledItems / totalItems) * 100);
    const matched = periodLines.reduce((a, l) => a + l.amountMatched, 0);
    const diff = periodLines.reduce((a, l) => a + l.differenceAmount, 0);
    const pendingAmount = Math.abs(sum(hoRows, 'Net') + sum(campusRows, 'Net'));

    return [
      { label: 'HO Debit',     value: fmt(sum(hoRows, 'Debit')) },
      { label: 'HO Credit',    value: fmt(sum(hoRows, 'Credit')) },
      { label: 'HO Net',       value: fmt(sum(hoRows, 'Net')), tone: 'primary' },
      { label: 'Campus Debit', value: fmt(sum(campusRows, 'Debit')) },
      { label: 'Campus Credit',value: fmt(sum(campusRows, 'Credit')) },
      { label: 'Campus Net',   value: fmt(sum(campusRows, 'Net')), tone: 'primary' },
      { label: 'Matched',      value: fmt(matched), tone: 'positive' },
      { label: 'Difference',   value: fmt(diff), tone: diff > 0 ? 'negative' : 'default' },
      { label: 'Pending Amt',  value: fmt(pendingAmount), tone: pendingAmount > 0 ? 'warning' : 'default' },
      { label: 'Total Items',  value: totalItems },
      { label: 'Reconciled',   value: reconciledItems, tone: 'positive' },
      { label: 'Completion %', value: `${completion}%`, tone: completion === 100 ? 'positive' : 'warning' },
    ];
  }, [hoRows, campusRows, periodLines]);

  // -------- actions
  const isLocked = period?.status === 'closed' && currentUser?.role !== 'super_admin';

  const reconcileNow = (note: string) => {
    if (!period || !hoSelected || !campusSelected) return;
    const ho = hoRows.find(r => r.id === hoSelected);
    const c = campusRows.find(r => r.id === campusSelected);
    if (!ho || !c) return;
    const cls = classifyManual(ho, c);
    reconcilePair(period.id, ho, c, cls.status, cls.matched, cls.difference, note);
    toast.success(cls.status === 'exact' ? 'Reconciled — exact match' : `Reconciled with difference ${fmt(cls.difference)}`);
    setHoSelected(null); setCampusSelected(null); setRemarks(''); setRemarksOpen(false);
  };

  const acceptSuggestion = (hoId: string, campusId: string) => {
    if (!period) return;
    const ho = hoRows.find(r => r.id === hoId);
    const c = campusRows.find(r => r.id === campusId);
    if (!ho || !c) return;
    const cls = classifyManual(ho, c);
    reconcilePair(period.id, ho, c, cls.status, cls.matched, cls.difference, 'Accepted suggested match');
    toast.success('Suggestion accepted');
  };

  const exportPeriodCsv = () => {
    if (!period) return;
    const header = [
      'Period','HO Co','Campus Co','HO Date','Campus Date','HO TransId','Campus TransId',
      'HO JE','Campus JE','HO Acct','Campus Acct','HO Acct Name','Campus Acct Name',
      'HO Debit','HO Credit','Campus Debit','Campus Credit','Matched','Difference','Status',
      'Reconciled By','Reconciled At','Remarks',
    ];
    const lines = periodLines.map(l => [
      period.periodMonth, l.hoCompany, l.campusCompany,
      l.hoPostingDate, l.campusPostingDate, l.hoTransId, l.campusTransId,
      l.hoJournalEntryNo, l.campusJournalEntryNo, l.hoAccountCode, l.campusAccountCode,
      l.hoAccountName, l.campusAccountName,
      l.hoDebit, l.hoCredit, l.campusDebit, l.campusCredit,
      l.amountMatched, l.differenceAmount, l.matchStatus,
      l.reconciledByUserName, l.reconciledAt, l.remarks,
    ].map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','));
    const csv = [header.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `reconciliation_${period.id}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const advance = (next: PeriodStatus) => {
    if (!period) return;
    setPeriodStatus(period.id, next);
    toast.success(`Period ${PERIOD_STATUS_LABELS[next].toLowerCase()}`);
  };

  // -------- render guards
  if (!campusOptions.length) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-xl font-bold text-foreground">No campuses available</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          You don't have access to any campus. Contact your administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inter-Company Reconciliation</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Mirror-effect matching between Head Office and campus ledgers, tick-off workflow, and monthly close.
          </p>
        </div>

        {period && (
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">{period.fiscalYear}</Badge>
            <Badge variant="secondary" className="text-xs">{PERIOD_STATUS_LABELS[period.status]}</Badge>
            {isLocked && <Badge variant="destructive" className="text-xs gap-1"><Lock size={11} />Locked</Badge>}
            <Button size="sm" variant="outline" onClick={exportPeriodCsv}>
              <Download size={14} className="mr-1.5" /> Export CSV
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Head Office</span>
              <Badge variant="outline" className="text-xs font-mono">{HO_DEFAULT}</Badge>
            </div>
            <div className="h-6 w-px bg-border mx-1" />
            <Select value={campus} onValueChange={setCampus}>
              <SelectTrigger className="h-8 w-[240px] text-xs"><SelectValue placeholder="Campus" /></SelectTrigger>
              <SelectContent>
                {campusOptions.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={periodMonth} onValueChange={setPeriodMonth}>
              <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue placeholder="Month" /></SelectTrigger>
              <SelectContent>
                {monthOptions.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
              <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending only</SelectItem>
                <SelectItem value="reconciled">Reconciled only</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative flex-1 min-w-[200px]">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search TransId, JE, memo, account…" className="pl-9 h-8 text-xs" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary cards */}
      <div className="mb-4">
        <SummaryCards stats={stats} />
      </div>

      <Tabs defaultValue="workspace" className="space-y-4">
        <TabsList className="bg-muted rounded-xl p-1 h-auto flex-wrap">
          <TabsTrigger value="workspace" className="rounded-lg gap-1.5 data-[state=active]:bg-background"><FileSpreadsheet size={14} /> Workspace</TabsTrigger>
          <TabsTrigger value="suggested" className="rounded-lg gap-1.5 data-[state=active]:bg-background"><Sparkles size={14} /> Suggested ({suggestions.length})</TabsTrigger>
          <TabsTrigger value="differences" className="rounded-lg gap-1.5 data-[state=active]:bg-background"><AlertCircle size={14} /> Differences</TabsTrigger>
          <TabsTrigger value="reconciled" className="rounded-lg gap-1.5 data-[state=active]:bg-background"><CheckCircle2 size={14} /> Reconciled ({periodLines.length})</TabsTrigger>
          <TabsTrigger value="audit" className="rounded-lg gap-1.5 data-[state=active]:bg-background"><ScrollText size={14} /> Audit</TabsTrigger>
          <TabsTrigger value="summary" className="rounded-lg gap-1.5 data-[state=active]:bg-background"><BarChart3 size={14} /> Summary</TabsTrigger>
          {canManageMapping && (
            <TabsTrigger value="mapping" className="rounded-lg gap-1.5 data-[state=active]:bg-background"><ClipboardCheck size={14} /> Mapping</TabsTrigger>
          )}
        </TabsList>

        {/* WORKSPACE */}
        <TabsContent value="workspace" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px]">
            <LedgerTable
              title="Head Office Ledger"
              subtitle={`${HO_DEFAULT} → ${campus}`}
              rows={hoRows}
              selectedId={hoSelected}
              reconciledIds={reconciledIds}
              suggestedIds={suggestedIds}
              acctNameLookup={acctNameLookup}
              onSelect={setHoSelected}
            />
            <LedgerTable
              title="Campus Ledger"
              subtitle={campus}
              rows={campusRows}
              selectedId={campusSelected}
              reconciledIds={reconciledIds}
              suggestedIds={suggestedIds}
              acctNameLookup={acctNameLookup}
              onSelect={setCampusSelected}
            />
          </div>

          {/* Action bar */}
          <Card>
            <CardContent className="p-3 flex items-center justify-between gap-3 flex-wrap">
              <div className="text-xs text-muted-foreground">
                {hoSelected && campusSelected
                  ? <span className="text-foreground font-medium">Pair selected — ready to reconcile</span>
                  : 'Select one HO row and one Campus row, then tick to reconcile.'}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {canDo && !isLocked && (
                  <Button
                    size="sm" disabled={!hoSelected || !campusSelected}
                    onClick={() => { setRemarks(''); setRemarksOpen(true); }}
                  >
                    <CheckCircle2 size={14} className="mr-1.5" /> Reconcile Selected
                  </Button>
                )}
                {canDo && period?.status === 'draft' && !isLocked && (
                  <Button size="sm" variant="outline" onClick={() => advance('submitted')}>
                    <Send size={14} className="mr-1.5" /> Submit
                  </Button>
                )}
                {canReview && period?.status === 'submitted' && !isLocked && (
                  <Button size="sm" variant="outline" onClick={() => advance('reviewed')}>
                    Review
                  </Button>
                )}
                {canClose && period?.status === 'reviewed' && !isLocked && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="default"><Lock size={14} className="mr-1.5" /> Close Month</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Close this period?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Closing locks all reconciled lines for this month. Only Super Admin can reopen.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => advance('closed')}>Close month</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                {currentUser?.role === 'super_admin' && period?.status === 'closed' && (
                  <Button size="sm" variant="outline" onClick={() => advance('draft')}>
                    <RotateCcw size={14} className="mr-1.5" /> Reopen
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SUGGESTED */}
        <TabsContent value="suggested">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>HO Date</TableHead>
                    <TableHead>HO JE</TableHead>
                    <TableHead className="text-right">HO Net</TableHead>
                    <TableHead>Campus Date</TableHead>
                    <TableHead>Campus JE</TableHead>
                    <TableHead className="text-right">Campus Net</TableHead>
                    <TableHead className="text-right">Δ</TableHead>
                    <TableHead>Reasons</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suggestions.length === 0 && (
                    <TableRow><TableCell colSpan={10} className="text-center py-12 text-muted-foreground text-sm">
                      No suggested matches for this filter.
                    </TableCell></TableRow>
                  )}
                  {suggestions.map(s => (
                    <TableRow key={`${s.hoRow.id}-${s.campusRow.id}`}>
                      <TableCell><StatusBadge status={s.status} /></TableCell>
                      <TableCell className="text-xs">{s.hoRow.PostingDate}</TableCell>
                      <TableCell className="text-xs font-mono">{s.hoRow.JournalEntryNo}</TableCell>
                      <TableCell className="text-right text-xs tabular-nums">{fmt(s.hoRow.Net)}</TableCell>
                      <TableCell className="text-xs">{s.campusRow.PostingDate}</TableCell>
                      <TableCell className="text-xs font-mono">{s.campusRow.JournalEntryNo}</TableCell>
                      <TableCell className="text-right text-xs tabular-nums">{fmt(s.campusRow.Net)}</TableCell>
                      <TableCell className={`text-right text-xs tabular-nums ${s.difference > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {fmt(s.difference)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{s.reasons.join(' · ')}</TableCell>
                      <TableCell className="text-right">
                        {canDo && !isLocked && (
                          <Button size="sm" variant="outline" onClick={() => acceptSuggestion(s.hoRow.id, s.campusRow.id)}>
                            Accept
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DIFFERENCES (unmatched after suggestions) */}
        <TabsContent value="differences">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Side</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>JE</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                    <TableHead>Memo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...hoRows.filter(r => !suggestedIds.has(r.id) && !reconciledIds.has(r.id)).map(r => ({ side: 'HO' as const, r })),
                    ...campusRows.filter(r => !suggestedIds.has(r.id) && !reconciledIds.has(r.id)).map(r => ({ side: 'Campus' as const, r }))]
                    .sort((a, b) => a.r.PostingDate.localeCompare(b.r.PostingDate))
                    .map(({ side, r }) => (
                    <TableRow key={r.id}>
                      <TableCell><Badge variant="outline" className="text-[10px]">{side}</Badge></TableCell>
                      <TableCell className="text-xs">{r.PostingDate}</TableCell>
                      <TableCell className="text-xs font-mono">{r.JournalEntryNo}</TableCell>
                      <TableCell className="text-xs">
                        <div>{acctNameLookup(r.AccountCode, r.Company)}</div>
                        <div className="font-mono text-muted-foreground">{r.AccountCode}</div>
                      </TableCell>
                      <TableCell className="text-right text-xs tabular-nums">{fmt(r.Debit)}</TableCell>
                      <TableCell className="text-right text-xs tabular-nums">{fmt(r.Credit)}</TableCell>
                      <TableCell className="text-xs max-w-[260px] truncate" title={r.JE_Memo}>{r.JE_Memo}</TableCell>
                    </TableRow>
                  ))}
                  {hoRows.length + campusRows.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-sm">No unmatched items.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RECONCILED */}
        <TabsContent value="reconciled">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>HO Date</TableHead>
                    <TableHead>Campus Date</TableHead>
                    <TableHead>JE</TableHead>
                    <TableHead className="text-right">Matched</TableHead>
                    <TableHead className="text-right">Δ</TableHead>
                    <TableHead>By</TableHead>
                    <TableHead>Remarks</TableHead>
                    {canUndo && !isLocked && <TableHead className="text-right">Action</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {periodLines.length === 0 && (
                    <TableRow><TableCell colSpan={canUndo ? 9 : 8} className="text-center py-12 text-muted-foreground text-sm">
                      Nothing reconciled for this period yet.
                    </TableCell></TableRow>
                  )}
                  {periodLines.map(l => (
                    <TableRow key={l.id}>
                      <TableCell><StatusBadge status={l.matchStatus} /></TableCell>
                      <TableCell className="text-xs">{l.hoPostingDate}</TableCell>
                      <TableCell className="text-xs">{l.campusPostingDate}</TableCell>
                      <TableCell className="text-xs font-mono">{l.hoJournalEntryNo}</TableCell>
                      <TableCell className="text-right text-xs tabular-nums">{fmt(l.amountMatched)}</TableCell>
                      <TableCell className={`text-right text-xs tabular-nums ${l.differenceAmount > 0 ? 'text-rose-600' : ''}`}>
                        {fmt(l.differenceAmount)}
                      </TableCell>
                      <TableCell className="text-xs">{l.reconciledByUserName}</TableCell>
                      <TableCell className="text-xs">
                        <Input
                          defaultValue={l.remarks}
                          className="h-7 text-xs"
                          disabled={isLocked}
                          onBlur={e => { if (e.target.value !== l.remarks) updateRemarks(l.id, e.target.value); }}
                        />
                      </TableCell>
                      {canUndo && !isLocked && (
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" onClick={() => { unreconcile(l.id); toast.success('Unreconciled'); }}>
                            Undo
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AUDIT */}
        <TabsContent value="audit">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>HO Co</TableHead>
                    <TableHead>Campus Co</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditTrail.slice(0, 200).map(a => (
                    <TableRow key={a.id}>
                      <TableCell className="text-xs whitespace-nowrap">{new Date(a.timestamp).toLocaleString()}</TableCell>
                      <TableCell className="text-xs">{a.userName}</TableCell>
                      <TableCell className="text-xs">{a.userRole}</TableCell>
                      <TableCell className="text-xs font-mono">{a.action}</TableCell>
                      <TableCell className="text-xs">{a.hoCompany ?? '—'}</TableCell>
                      <TableCell className="text-xs">{a.campusCompany ?? '—'}</TableCell>
                      <TableCell className="text-xs">{a.periodMonth ?? '—'}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{a.remarks ?? a.newStatus ?? ''}</TableCell>
                    </TableRow>
                  ))}
                  {auditTrail.length === 0 && (
                    <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground text-sm">No audit entries yet.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SUMMARY */}
        <TabsContent value="summary">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>HO Co</TableHead>
                    <TableHead>Campus Co</TableHead>
                    <TableHead>FY</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Reconciled Lines</TableHead>
                    <TableHead className="text-right">Matched</TableHead>
                    <TableHead className="text-right">Difference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {periods.length === 0 && (
                    <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground text-sm">No periods yet.</TableCell></TableRow>
                  )}
                  {periods.map(p => {
                    const lines = reconciledLines.filter(l => l.reconciliationPeriodId === p.id);
                    const matched = lines.reduce((a, l) => a + l.amountMatched, 0);
                    const diff = lines.reduce((a, l) => a + l.differenceAmount, 0);
                    return (
                      <TableRow key={p.id}>
                        <TableCell className="text-xs">{p.periodMonth}</TableCell>
                        <TableCell className="text-xs">{p.hoCompany}</TableCell>
                        <TableCell className="text-xs">{p.campusCompany}</TableCell>
                        <TableCell className="text-xs">{p.fiscalYear}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{PERIOD_STATUS_LABELS[p.status]}</Badge></TableCell>
                        <TableCell className="text-right text-xs tabular-nums">{lines.length}</TableCell>
                        <TableCell className="text-right text-xs tabular-nums">{fmt(matched)}</TableCell>
                        <TableCell className={`text-right text-xs tabular-nums ${diff > 0 ? 'text-rose-600' : ''}`}>{fmt(diff)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MAPPING (gated) */}
        {canManageMapping && (
          <TabsContent value="mapping">
            <IntercompanyMappingScreen />
          </TabsContent>
        )}
      </Tabs>

      {/* Remarks dialog before reconciling */}
      <Dialog open={remarksOpen} onOpenChange={setRemarksOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add remarks (optional)</DialogTitle>
            <DialogDescription>
              Document why these two lines are being reconciled. This will be stored on the reconciled record.
            </DialogDescription>
          </DialogHeader>
          <Textarea value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="e.g. Bank settlement timing — campus posted next day" rows={4} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemarksOpen(false)}>Cancel</Button>
            <Button onClick={() => reconcileNow(remarks)}>Reconcile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// helpers
function searchFilter(q: string) {
  const s = q.trim().toLowerCase();
  return (r: GeneralLedgerRow) => {
    if (!s) return true;
    return r.TransId.toLowerCase().includes(s)
      || r.JournalEntryNo.toLowerCase().includes(s)
      || r.JE_Memo.toLowerCase().includes(s)
      || r.ShortName.toLowerCase().includes(s)
      || r.AccountCode.toLowerCase().includes(s);
  };
}

function statusGate(status: 'all' | 'pending' | 'reconciled', reconciledIds: Set<string>) {
  return (r: GeneralLedgerRow) => {
    if (status === 'all') return true;
    const isRec = reconciledIds.has(r.id);
    return status === 'reconciled' ? isRec : !isRec;
  };
}
