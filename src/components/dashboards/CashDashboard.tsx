import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CASH_DATA } from '@/data/dummyDashboardData';
import { KpiCard } from './KpiCard';

export function CashDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CASH_DATA.kpis.map(k => (
          <KpiCard key={k.label} label={k.label} value={k.value} />
        ))}
      </div>
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">13-Week Cash Forecast (PKR M)</h3>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={CASH_DATA.forecast}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="week" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
            <Legend />
            <Bar dataKey="inflow" name="Inflow" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="outflow" name="Outflow" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="balance" name="Balance" stroke="hsl(var(--foreground))" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
