import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { COMPLIANCE_DATA } from '@/data/dummyDashboardData';
import { cn } from '@/lib/utils';
import { ShieldCheck, ShieldAlert, Clock } from 'lucide-react';

const RISK_COLORS = ['hsl(var(--primary))', 'hsl(var(--muted-foreground))', 'hsl(var(--destructive))'];

const STATUS_ICON = {
  Compliant: <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />,
  'In Progress': <Clock size={14} className="text-primary" />,
  'Action Needed': <ShieldAlert size={14} className="text-destructive" />,
};

export function ComplianceDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Compliance Status</h3>
          <div className="space-y-2">
            {COMPLIANCE_DATA.status.map(s => (
              <div key={s.area} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  {STATUS_ICON[s.status as keyof typeof STATUS_ICON]}
                  <div>
                    <p className="font-medium text-sm text-card-foreground">{s.area}</p>
                    <p className="text-xs text-muted-foreground">Due: {s.dueDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full',
                    s.risk === 'Low' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                    s.risk === 'Medium' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                    s.risk === 'High' && 'bg-red-100 text-destructive dark:bg-red-900/30',
                  )}>{s.risk} Risk</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={COMPLIANCE_DATA.riskDistribution} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                {COMPLIANCE_DATA.riskDistribution.map((_, i) => <Cell key={i} fill={RISK_COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
