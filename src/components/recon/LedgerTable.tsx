import { useMemo } from 'react';
import { GeneralLedgerRow, MatchStatus } from '@/lib/recon/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { StatusBadge } from './StatusBadge';
import { cn } from '@/lib/utils';

interface Props {
  title: string;
  subtitle?: string;
  rows: GeneralLedgerRow[];
  selectedId: string | null;
  reconciledIds: Set<string>;
  suggestedIds: Set<string>;
  acctNameLookup: (acctCode: string, company: string) => string;
  onSelect: (id: string | null) => void;
}

const fmt = (n: number) => n === 0 ? '—' : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function LedgerTable({
  title, subtitle, rows, selectedId, reconciledIds, suggestedIds, acctNameLookup, onSelect,
}: Props) {
  const totals = useMemo(() => rows.reduce((a, r) => ({
    debit: a.debit + r.Debit, credit: a.credit + r.Credit, net: a.net + r.Net,
  }), { debit: 0, credit: 0, net: 0 }), [rows]);

  return (
    <div className="border rounded-lg bg-card flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b bg-muted/30">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">{title}</div>
            {subtitle && <div className="text-[11px] text-muted-foreground">{subtitle}</div>}
          </div>
          <div className="text-[11px] text-muted-foreground tabular-nums">
            {rows.length} rows · Net <span className="text-foreground font-semibold">{fmt(totals.net)}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead className="whitespace-nowrap">Date</TableHead>
              <TableHead>JE No</TableHead>
              <TableHead className="min-w-[180px]">Account</TableHead>
              <TableHead className="text-right">Debit</TableHead>
              <TableHead className="text-right">Credit</TableHead>
              <TableHead>Memo</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground text-sm">
                No ledger rows for this filter.
              </TableCell></TableRow>
            )}
            {rows.map(r => {
              const isReconciled = reconciledIds.has(r.id);
              const isSuggested = !isReconciled && suggestedIds.has(r.id);
              const isSelected = selectedId === r.id;
              const status: MatchStatus = isReconciled ? 'reconciled' : isSuggested ? 'suggested' : 'pending';
              return (
                <TableRow
                  key={r.id}
                  className={cn(
                    'cursor-pointer transition-colors',
                    isSelected && 'bg-primary/10 hover:bg-primary/15',
                    isReconciled && 'opacity-60',
                  )}
                  onClick={() => !isReconciled && onSelect(isSelected ? null : r.id)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      disabled={isReconciled}
                      onCheckedChange={(v) => onSelect(v ? r.id : null)}
                    />
                  </TableCell>
                  <TableCell className="text-xs whitespace-nowrap">{r.PostingDate}</TableCell>
                  <TableCell className="text-xs font-mono">{r.JournalEntryNo}</TableCell>
                  <TableCell className="text-xs">
                    <div className="font-medium">{acctNameLookup(r.AccountCode, r.Company)}</div>
                    <div className="text-muted-foreground font-mono">{r.AccountCode} · {r.ShortName}</div>
                  </TableCell>
                  <TableCell className="text-right text-xs tabular-nums">{fmt(r.Debit)}</TableCell>
                  <TableCell className="text-right text-xs tabular-nums">{fmt(r.Credit)}</TableCell>
                  <TableCell className="text-xs max-w-[160px] truncate" title={r.JE_Memo}>{r.JE_Memo}</TableCell>
                  <TableCell><StatusBadge status={status} /></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="border-t bg-muted/30 px-3 py-2 grid grid-cols-3 text-[11px] tabular-nums">
        <div>Total Debit: <span className="font-semibold text-foreground">{fmt(totals.debit)}</span></div>
        <div>Total Credit: <span className="font-semibold text-foreground">{fmt(totals.credit)}</span></div>
        <div>Net: <span className="font-semibold text-foreground">{fmt(totals.net)}</span></div>
      </div>
    </div>
  );
}
