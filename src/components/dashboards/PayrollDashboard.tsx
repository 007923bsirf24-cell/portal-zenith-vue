import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PAYROLL_DATA } from '@/data/dummyDashboardData';
import { KpiCard, ChartCard, TableCard } from './KpiCard';
import { DashboardFilters, useDashboardFilters } from './DashboardFilters';
import { DollarSign, Users, Calculator, TrendingUp } from 'lucide-react';

const PIE_COLORS = ['hsl(var(--primary))', 'hsl(199, 89%, 48%)', 'hsl(var(--destructive))', 'hsl(45, 93%, 47%)'];
const TOOLTIP_STYLE = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12, boxShadow: '0 8px 32px hsl(0 0% 0% / 0.12)' };
const KPI_ICONS = [<DollarSign size={18} />, <Users size={18} />, <Calculator size={18} />, <TrendingUp size={18} />];

export function PayrollDashboard() {
  const { campus, setCampus, year, setYear, activeCampus } = useDashboardFilters();
  const data = PAYROLL_DATA[activeCampus];

  return (
    <div className="space-y-6">
      <DashboardFilters campus={campus} setCampus={setCampus} year={year} setYear={setYear} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {data.kpis.map((k, i) => <KpiCard key={k.label} {...k} icon={KPI_ICONS[i]} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <ChartCard title="Payroll Cost by Department" subtitle="Horizontal breakdown (PKR M)" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.byDept} layout="vertical" barSize={22}>
              <defs>
                <linearGradient id="payrollBarGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="dept" type="category" width={110} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="cost" name="Cost (PKR M)" fill="url(#payrollBarGrad)" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Staff by Pay Grade" subtitle="Grade distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.byGrade} cx="50%" cy="45%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={4} cornerRadius={6} label={({ percent }) => `${(percent * 100).toFixed(0)}%`} style={{ fontSize: 10, fontWeight: 600 }}>
                {data.byGrade.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Monthly Payroll Trend" subtitle="Cost over academic year (PKR M)">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data.trend}>
            <defs>
              <linearGradient id="payrollTrendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Area type="monotone" dataKey="cost" name="Cost" stroke="hsl(var(--primary))" fill="url(#payrollTrendGrad)" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <TableCard
        title="Department Headcount & Cost Detail"
        headers={['Department', 'Headcount', 'Cost (PKR M)', 'Avg per Head (PKR K)']}
        rows={data.byDept.map(d => [
          <span className="font-semibold">{d.dept}</span>,
          d.headcount.toString(),
          d.cost.toFixed(1),
          ((d.cost * 1000) / d.headcount).toFixed(0),
        ])}
      />
    </div>
  );
}
