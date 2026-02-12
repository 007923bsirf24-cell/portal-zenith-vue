import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  className?: string;
}

export function KpiCard({ label, value, change, positive, className }: KpiCardProps) {
  return (
    <div className={cn("rounded-xl border bg-card p-4 sm:p-5 space-y-1.5", className)}>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-card-foreground tracking-tight">{value}</p>
      {change && (
        <div className={cn('flex items-center gap-1 text-xs font-medium',
          positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'
        )}>
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change} vs last year
        </div>
      )}
    </div>
  );
}

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function ChartCard({ title, children, className, action }: ChartCardProps) {
  return (
    <div className={cn("rounded-xl border bg-card p-5 sm:p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-card-foreground">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

interface TableCardProps {
  title: string;
  headers: string[];
  rows: (string | React.ReactNode)[][];
  className?: string;
}

export function TableCard({ title, headers, rows, className }: TableCardProps) {
  return (
    <div className={cn("rounded-xl border bg-card p-5 sm:p-6", className)}>
      <h3 className="text-sm font-semibold text-card-foreground mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {headers.map(h => (
                <th key={h} className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className="py-2.5 px-3 text-card-foreground">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles = {
    Compliant: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Complete: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'In Progress': 'bg-primary/10 text-primary',
    'Action Needed': 'bg-destructive/10 text-destructive',
    Pending: 'bg-muted text-muted-foreground',
    High: 'bg-destructive/10 text-destructive',
    Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Due Soon': 'bg-destructive/10 text-destructive',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
      styles[status as keyof typeof styles] || 'bg-muted text-muted-foreground'
    )}>
      {status}
    </span>
  );
}
