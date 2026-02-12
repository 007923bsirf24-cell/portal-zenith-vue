import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { EXECUTIVE_DATA } from '@/data/dummyDashboardData';
import { KpiCard } from './KpiCard';

export function ExecutiveDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {EXECUTIVE_DATA.kpis.map(k => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">Revenue vs Budget (PKR M)</h3>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={EXECUTIVE_DATA.revenue}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
            <Legend />
            <Area type="monotone" dataKey="actual" name="Actual" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} />
            <Area type="monotone" dataKey="budget" name="Budget" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground))" fillOpacity={0.08} strokeWidth={2} strokeDasharray="5 5" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
