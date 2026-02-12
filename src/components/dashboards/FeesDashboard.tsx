import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { FEES_DATA } from '@/data/dummyDashboardData';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted-foreground))', 'hsl(var(--destructive))', 'hsl(var(--accent-foreground))'];

export function FeesDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Fee Collection Rate (%)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={FEES_DATA.collection}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="collected" name="Collected" stackId="a" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="outstanding" name="Outstanding" stackId="a" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Receivables Aging</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={FEES_DATA.aging} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                {FEES_DATA.aging.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
