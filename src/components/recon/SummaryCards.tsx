import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface SummaryStat {
  label: string;
  value: string | number;
  hint?: string;
  tone?: 'default' | 'positive' | 'negative' | 'warning' | 'primary';
}

const TONE: Record<NonNullable<SummaryStat['tone']>, string> = {
  default: 'text-foreground',
  positive: 'text-emerald-600 dark:text-emerald-400',
  negative: 'text-rose-600 dark:text-rose-400',
  warning: 'text-amber-600 dark:text-amber-400',
  primary: 'text-primary',
};

export function SummaryCards({ stats }: { stats: SummaryStat[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
      {stats.map((s) => (
        <Card key={s.label} className="border-border/60">
          <CardContent className="p-3">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{s.label}</div>
            <div className={cn('text-lg font-bold mt-0.5 tabular-nums', TONE[s.tone ?? 'default'])}>
              {s.value}
            </div>
            {s.hint && <div className="text-[10px] text-muted-foreground mt-0.5">{s.hint}</div>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
