import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadialBarChart, RadialBar } from 'recharts';
import { EXECUTIVE_DATA } from '@/data/dummyDashboardData';
import { KpiCard, ChartCard, Sparkline, ProgressRing } from './KpiCard';
import { DashboardFilters, useDashboardFilters } from './DashboardFilters';
import { DollarSign, Users, GraduationCap, Percent, UserCheck, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';

const GRADIENT_COLORS = [
  { start: 'hsl(var(--primary))', end: 'hsl(var(--accent))' },
  { start: 'hsl(var(--destructive))', end: 'hsl(217, 91%, 60%)' },
];
const PIE_COLORS = ['hsl(var(--primary))', 'hsl(199, 89%, 48%)', 'hsl(var(--destructive))', 'hsl(45, 93%, 47%)', 'hsl(280, 67%, 55%)'];
const TOOLTIP_STYLE = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12, boxShadow: '0 8px 32px hsl(0 0% 0% / 0.12)' };

const KPI_ICONS = [
  <DollarSign size={18} />,
  <Percent size={18} />,
  <GraduationCap size={18} />,
  <UserCheck size={18} />,
  <Users size={18} />,
  <Calculator size={18} />,
];

export function ExecutiveDashboard() {
  const { campus, setCampus, year, setYear, activeCampus } = useDashboardFilters();
  const data = EXECUTIVE_DATA[activeCampus];

  return (
    <div className="space-y-6">
      <DashboardFilters campus={campus} setCampus={setCampus} year={year} setYear={setYear} />

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {data.kpis.map((k, i) => (
          <KpiCard key={k.label} {...k} icon={KPI_ICONS[i]} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <ChartCard title="Revenue vs Budget vs Last Year" subtitle="Monthly comparison (PKR M)" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={data.revenueTrend}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(var(--primary))" fill="url(#revGrad)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 2 }} />
              <Area type="monotone" dataKey="budget" name="Budget" stroke="hsl(var(--muted-foreground))" fill="transparent" strokeWidth={1.5} strokeDasharray="6 4" dot={false} />
              <Area type="monotone" dataKey="lastYear" name="Last Year" stroke="hsl(var(--destructive))" fill="transparent" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue by Stream" subtitle="Distribution breakdown">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <defs>
                {PIE_COLORS.map((c, i) => (
                  <linearGradient key={i} id={`pie${i}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={c} stopOpacity={1} />
                    <stop offset="100%" stopColor={c} stopOpacity={0.7} />
                  </linearGradient>
                ))}
              </defs>
              <Pie 
                data={data.revenueByStream} cx="50%" cy="45%" 
                innerRadius={60} outerRadius={95} 
                dataKey="value" paddingAngle={4} 
                cornerRadius={6}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} 
                labelLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
                style={{ fontSize: 9, fontWeight: 600 }}
              >
                {data.revenueByStream.map((_, i) => <Cell key={i} fill={`url(#pie${i % PIE_COLORS.length})`} />)}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Operating Expenses by Category" subtitle="Horizontal breakdown (PKR M)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.expenseBreakdown} layout="vertical" barSize={20}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="category" type="category" width={80} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="amount" fill="url(#barGrad)" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Student Enrollment Trend" subtitle="Monthly progression">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.enrollmentTrend}>
              <defs>
                <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="students" stroke="hsl(199, 89%, 48%)" fill="url(#enrollGrad)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: 'hsl(199, 89%, 48%)', strokeWidth: 2, stroke: 'hsl(var(--card))' }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
