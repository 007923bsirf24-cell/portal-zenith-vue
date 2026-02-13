import { BarChart, Bar, PieChart, Pie, Cell, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FEES_DATA } from '@/data/dummyDashboardData';
import { KpiCard, ChartCard, TableCard, StatusBadge, ProgressRing } from './KpiCard';
import { DashboardFilters, useDashboardFilters } from './DashboardFilters';
import { Receipt, Banknote, AlertCircle, CheckCircle } from 'lucide-react';

const PIE_COLORS = ['hsl(var(--primary))', 'hsl(199, 89%, 48%)', 'hsl(var(--destructive))', 'hsl(45, 93%, 47%)', 'hsl(280, 67%, 55%)'];
const TOOLTIP_STYLE = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12, boxShadow: '0 8px 32px hsl(0 0% 0% / 0.12)' };
const KPI_ICONS = [<Receipt size={18} />, <Banknote size={18} />, <AlertCircle size={18} />, <CheckCircle size={18} />];

export function FeesDashboard() {
  const { campus, setCampus, year, setYear, activeCampus } = useDashboardFilters();
  const data = FEES_DATA[activeCampus];

  return (
    <div className="space-y-6">
      <DashboardFilters campus={campus} setCampus={setCampus} year={year} setYear={setYear} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {data.kpis.map((k, i) => <KpiCard key={k.label} {...k} icon={KPI_ICONS[i]} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <ChartCard title="Billed vs Collected with Collection Rate" subtitle="Monthly trend (PKR M)" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={data.collectionTrend}>
              <defs>
                <linearGradient id="billedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="collGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" domain={[70, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
              <Bar yAxisId="left" dataKey="billed" name="Billed" fill="url(#billedGrad)" radius={[6, 6, 0, 0]} />
              <Bar yAxisId="left" dataKey="collected" name="Collected" fill="url(#collGrad)" radius={[6, 6, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="rate" name="Rate %" stroke="hsl(var(--destructive))" strokeWidth={2.5} dot={{ r: 3, fill: 'hsl(var(--destructive))' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Outstanding by Class Level" subtitle="Distribution breakdown">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={data.byClass} cx="50%" cy="45%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={4} cornerRadius={6} label={({ percent }) => `${(percent * 100).toFixed(0)}%`} style={{ fontSize: 10, fontWeight: 600 }}>
                {data.byClass.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <TableCard
        title="Receivables Aging Detail"
        headers={['Aging Bucket', 'Amount (PKR M)', 'No. of Students', '% of Total']}
        rows={data.aging.map(a => {
          const total = data.aging.reduce((s, x) => s + x.amount, 0);
          const pct = ((a.amount / total) * 100).toFixed(1);
          return [
            a.bucket,
            a.amount.toFixed(1),
            a.count.toString(),
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
              <span>{pct}%</span>
            </div>,
          ];
        })}
      />
    </div>
  );
}
