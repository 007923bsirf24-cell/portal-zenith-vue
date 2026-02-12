import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
}

export function KpiCard({ label, value, change, positive }: KpiCardProps) {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-xl font-bold text-card-foreground">{value}</p>
      {change && (
        <div className={cn('flex items-center gap-1 text-xs font-medium',
          positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'
        )}>
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </div>
      )}
    </div>
  );
}
