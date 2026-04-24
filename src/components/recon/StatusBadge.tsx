import { Badge } from '@/components/ui/badge';
import { MatchStatus, STATUS_LABELS } from '@/lib/recon/types';
import { cn } from '@/lib/utils';

const STYLES: Record<MatchStatus, string> = {
  pending:    'bg-muted text-muted-foreground border-transparent',
  suggested:  'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-transparent',
  possible:   'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-transparent',
  exact:      'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-transparent',
  difference: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-transparent',
  unmatched:  'bg-zinc-500/15 text-zinc-700 dark:text-zinc-300 border-transparent',
  reconciled: 'bg-primary/15 text-primary border-transparent',
};

export function StatusBadge({ status, className }: { status: MatchStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn('text-[10px] font-medium px-1.5 py-0 h-5', STYLES[status], className)}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
