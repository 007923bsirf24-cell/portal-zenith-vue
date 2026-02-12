import { PieChart, Pie, Cell, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { COMPLIANCE_DATA } from '@/data/dummyDashboardData';
import { KpiCard, ChartCard, TableCard, StatusBadge } from './KpiCard';
import { DashboardFilters, useDashboardFilters } from './DashboardFilters';

const RISK_COLORS = ['hsl(var(--primary))', 'hsl(var(--muted-foreground))', 'hsl(var(--destructive))'];
const TOOLTIP_STYLE = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 };

export function ComplianceDashboard() {
  const { campus, setCampus, year, setYear } = useDashboardFilters();

  return (
    <div className="space-y-5">
      <DashboardFilters campus={campus} setCampus={setCampus} year={year} setYear={setYear} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {COMPLIANCE_DATA.kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <ChartCard title="Compliance Score Trend" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={COMPLIANCE_DATA.trend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis yAxisId="left" domain={[60, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line yAxisId="left" type="monotone" dataKey="score" name="Score %" stroke="hsl(var(--primary))" strokeWidth={2} />
              <Bar yAxisId="right" dataKey="items" name="Open Items" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} fillOpacity={0.6} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Risk Distribution">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={COMPLIANCE_DATA.riskDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" paddingAngle={3} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} style={{ fontSize: 10 }}>
                {COMPLIANCE_DATA.riskDistribution.map((_, i) => <Cell key={i} fill={RISK_COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <TableCard
        title="Compliance Items Detail"
        headers={['Area', 'Status', 'Due Date', 'Risk', 'Owner']}
        rows={COMPLIANCE_DATA.items.map(s => [
          s.area,
          <StatusBadge status={s.status} />,
          s.dueDate,
          <StatusBadge status={s.risk} />,
          s.owner,
        ])}
      />
    </div>
  );
}
