import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BUDGET_DATA } from '@/data/dummyDashboardData';
import { KpiCard } from './KpiCard';

export function BudgetDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {BUDGET_DATA.summary.map(k => (
          <KpiCard key={k.label} label={k.label} value={k.value} />
        ))}
      </div>
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">Budget vs Actual by Department (PKR M)</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={BUDGET_DATA.variance}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="dept" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
            <Legend />
            <Bar dataKey="budget" name="Budget" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" name="Actual" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
