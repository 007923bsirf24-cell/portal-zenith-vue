import { PieChart, Pie, Cell, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CLOSE_PACK_DATA } from '@/data/dummyDashboardData';
import { KpiCard, ChartCard, TableCard, StatusBadge } from './KpiCard';
import { DashboardFilters, useDashboardFilters } from './DashboardFilters';

const PROGRESS_COLORS = ['hsl(var(--primary))', 'hsl(var(--muted-foreground))', 'hsl(var(--destructive))'];
const TOOLTIP_STYLE = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 };

export function ClosePackDashboard() {
  const { campus, setCampus, year, setYear } = useDashboardFilters();

  return (
    <div className="space-y-5">
      <DashboardFilters campus={campus} setCampus={setCampus} year={year} setYear={setYear} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {CLOSE_PACK_DATA.summary.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <ChartCard title="Days to Close Trend" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={CLOSE_PACK_DATA.timeline}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="daysToClose" name="Days to Close" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="target" name="Target" stroke="hsl(var(--destructive))" strokeWidth={2} strokeDasharray="5 5" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Close Progress">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={CLOSE_PACK_DATA.progress} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} style={{ fontSize: 10 }}>
                {CLOSE_PACK_DATA.progress.map((_, i) => <Cell key={i} fill={PROGRESS_COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <TableCard
        title="Month-End Close Checklist"
        headers={['Task', 'Status', 'Owner', 'Time Spent']}
        rows={CLOSE_PACK_DATA.checklist.map(t => [
          t.task,
          <StatusBadge status={t.status} />,
          t.owner,
          t.time,
        ])}
      />
    </div>
  );
}
