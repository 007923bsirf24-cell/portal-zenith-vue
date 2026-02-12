import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { EXECUTIVE_DATA } from '@/data/dummyDashboardData';
import { KpiCard, ChartCard } from './KpiCard';
import { DashboardFilters, useDashboardFilters } from './DashboardFilters';

const PIE_COLORS = ['hsl(var(--primary))', 'hsl(var(--muted-foreground))', 'hsl(var(--destructive))', 'hsl(var(--accent-foreground))', 'hsl(var(--secondary-foreground))'];
const TOOLTIP_STYLE = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 };

export function ExecutiveDashboard() {
  const { campus, setCampus, year, setYear, activeCampus } = useDashboardFilters();
  const data = EXECUTIVE_DATA[activeCampus];

  return (
    <div className="space-y-5">
      <DashboardFilters campus={campus} setCampus={setCampus} year={year} setYear={setYear} />

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {data.kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <ChartCard title="Revenue vs Budget vs Last Year (PKR M)" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} />
              <Area type="monotone" dataKey="budget" name="Budget" stroke="hsl(var(--muted-foreground))" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              <Area type="monotone" dataKey="lastYear" name="Last Year" stroke="hsl(var(--destructive))" fill="transparent" strokeWidth={1.5} strokeDasharray="3 3" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue by Stream">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.revenueByStream} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={3} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} labelLine={false} style={{ fontSize: 10 }}>
                {data.revenueByStream.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Operating Expenses by Category (PKR M)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.expenseBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis dataKey="category" type="category" width={80} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Student Enrollment Trend">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.enrollmentTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="students" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
