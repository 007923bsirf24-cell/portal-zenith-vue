import { PieChart, Pie, Cell, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CLOSE_PACK_DATA } from '@/data/dummyDashboardData';
import { KpiCard, ChartCard, TableCard, StatusBadge, ProgressRing } from './KpiCard';
import { DashboardFilters, useDashboardFilters } from './DashboardFilters';
import { ListChecks, CheckCircle, Loader2, CircleDashed } from 'lucide-react';
import { motion } from 'framer-motion';

const PROGRESS_COLORS = ['hsl(142, 71%, 45%)', 'hsl(var(--primary))', 'hsl(var(--muted-foreground))'];
const TOOLTIP_STYLE = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12, boxShadow: '0 8px 32px hsl(0 0% 0% / 0.12)' };
const KPI_ICONS = [<ListChecks size={18} />, <CheckCircle size={18} />, <Loader2 size={18} />, <CircleDashed size={18} />];

export function ClosePackDashboard() {
  const { campus, setCampus, year, setYear } = useDashboardFilters();

  return (
    <div className="space-y-6">
      <DashboardFilters campus={campus} setCampus={setCampus} year={year} setYear={setYear} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CLOSE_PACK_DATA.summary.map((k, i) => <KpiCard key={k.label} {...k} icon={KPI_ICONS[i]} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <ChartCard title="Days to Close Trend" subtitle="Monthly comparison vs target" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={CLOSE_PACK_DATA.timeline}>
              <defs>
                <linearGradient id="closeBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
              <Bar dataKey="daysToClose" name="Days to Close" fill="url(#closeBarGrad)" radius={[8, 8, 0, 0]} barSize={28} />
              <Line type="monotone" dataKey="target" name="Target" stroke="hsl(var(--destructive))" strokeWidth={2.5} strokeDasharray="6 4" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Close Progress" subtitle="Task completion status" className="flex flex-col items-center justify-center">
          <div className="py-4">
            <ProgressRing value={58} size={150} strokeWidth={14} label="tasks completed" color="hsl(142, 71%, 45%)" />
          </div>
          <div className="flex gap-4 mt-2">
            {CLOSE_PACK_DATA.progress.map((p, i) => (
              <div key={p.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: PROGRESS_COLORS[i] }} />
                <span className="text-muted-foreground">{p.name}: {p.value}%</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <TableCard
        title="Month-End Close Checklist"
        headers={['Task', 'Status', 'Owner', 'Time Spent']}
        rows={CLOSE_PACK_DATA.checklist.map(t => [
          <span className="font-semibold">{t.task}</span>,
          <StatusBadge status={t.status} />,
          <span className="text-muted-foreground">{t.owner}</span>,
          <span className={t.time === '—' ? 'text-muted-foreground' : 'font-medium'}>{t.time}</span>,
        ])}
      />
    </div>
  );
}
