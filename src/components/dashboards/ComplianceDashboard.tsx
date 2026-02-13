import { PieChart, Pie, Cell, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { COMPLIANCE_DATA } from '@/data/dummyDashboardData';
import { KpiCard, ChartCard, TableCard, StatusBadge, ProgressRing } from './KpiCard';
import { DashboardFilters, useDashboardFilters } from './DashboardFilters';
import { ShieldCheck, AlertCircle, Clock, Award } from 'lucide-react';

const RISK_COLORS = ['hsl(142, 71%, 45%)', 'hsl(45, 93%, 47%)', 'hsl(var(--destructive))'];
const TOOLTIP_STYLE = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12, boxShadow: '0 8px 32px hsl(0 0% 0% / 0.12)' };
const KPI_ICONS = [<ShieldCheck size={18} />, <AlertCircle size={18} />, <Clock size={18} />, <Award size={18} />];

export function ComplianceDashboard() {
  const { campus, setCampus, year, setYear } = useDashboardFilters();

  return (
    <div className="space-y-6">
      <DashboardFilters campus={campus} setCampus={setCampus} year={year} setYear={setYear} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {COMPLIANCE_DATA.kpis.map((k, i) => <KpiCard key={k.label} {...k} icon={KPI_ICONS[i]} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <ChartCard title="Compliance Score Trend" subtitle="Score vs open items" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={COMPLIANCE_DATA.trend}>
              <defs>
                <linearGradient id="compScoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" domain={[60, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
              <Bar yAxisId="right" dataKey="items" name="Open Items" fill="hsl(var(--destructive))" fillOpacity={0.2} stroke="hsl(var(--destructive))" strokeWidth={1} radius={[6, 6, 0, 0]} />
              <Line yAxisId="left" type="monotone" dataKey="score" name="Score %" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, fill: 'hsl(var(--primary))' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Risk Distribution" subtitle="Current risk profile" className="flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={COMPLIANCE_DATA.riskDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={4} cornerRadius={6} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} style={{ fontSize: 9, fontWeight: 600 }}>
                  {COMPLIANCE_DATA.riskDistribution.map((_, i) => <Cell key={i} fill={RISK_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <TableCard
        title="Compliance Items Detail"
        headers={['Area', 'Status', 'Due Date', 'Risk', 'Owner']}
        rows={COMPLIANCE_DATA.items.map(s => [
          <span className="font-semibold">{s.area}</span>,
          <StatusBadge status={s.status} />,
          s.dueDate,
          <StatusBadge status={s.risk} />,
          <span className="text-muted-foreground">{s.owner}</span>,
        ])}
      />
    </div>
  );
}
