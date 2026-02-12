import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { CLOSE_PACK_DATA } from '@/data/dummyDashboardData';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, Circle } from 'lucide-react';

const PROGRESS_COLORS = ['hsl(var(--primary))', 'hsl(var(--muted-foreground))', 'hsl(var(--destructive))'];

const STATUS_ICON = {
  Complete: <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />,
  'In Progress': <Clock size={14} className="text-primary" />,
  Pending: <Circle size={14} className="text-muted-foreground" />,
};

export function ClosePackDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Month-End Close Checklist</h3>
          <div className="space-y-2">
            {CLOSE_PACK_DATA.checklist.map(t => (
              <div key={t.task} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  {STATUS_ICON[t.status as keyof typeof STATUS_ICON]}
                  <div>
                    <p className="font-medium text-sm text-card-foreground">{t.task}</p>
                    <p className="text-xs text-muted-foreground">{t.owner}</p>
                  </div>
                </div>
                <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full',
                  t.status === 'Complete' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                  t.status === 'In Progress' && 'bg-primary/10 text-primary',
                  t.status === 'Pending' && 'bg-muted text-muted-foreground',
                )}>{t.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Close Progress</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={CLOSE_PACK_DATA.progress} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                {CLOSE_PACK_DATA.progress.map((_, i) => <Cell key={i} fill={PROGRESS_COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
