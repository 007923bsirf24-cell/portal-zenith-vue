import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CAPEX_DATA } from '@/data/dummyDashboardData';
import { KpiCard, ChartCard, ProgressRing } from './KpiCard';
import { DashboardFilters, useDashboardFilters } from './DashboardFilters';
import { Building, TrendingUp, Lock, Unlock } from 'lucide-react';
import { motion } from 'framer-motion';

const TOOLTIP_STYLE = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12, boxShadow: '0 8px 32px hsl(0 0% 0% / 0.12)' };
const KPI_ICONS = [<Building size={18} />, <TrendingUp size={18} />, <Lock size={18} />, <Unlock size={18} />];

export function CapexDashboard() {
  const { campus, setCampus, year, setYear, activeCampus } = useDashboardFilters();
  const data = CAPEX_DATA[activeCampus];

  return (
    <div className="space-y-6">
      <DashboardFilters campus={campus} setCampus={setCampus} year={year} setYear={setYear} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {data.kpis.map((k, i) => <KpiCard key={k.label} {...k} icon={KPI_ICONS[i]} />)}
      </div>

      <ChartCard title="Capital Projects Progress" subtitle="Budget utilization & timeline">
        <div className="grid sm:grid-cols-2 gap-6">
          {data.projects.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group p-4 rounded-xl border bg-background/50 hover:bg-primary/[0.03] transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm text-card-foreground">{p.name}</span>
                <span className="text-xs font-bold text-primary">{p.progress}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${p.progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: i * 0.1 }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                />
              </div>
              <div className="flex justify-between mt-2 text-[11px] text-muted-foreground">
                <span>PKR {p.spent}M spent</span>
                <span>PKR {p.budget}M budget</span>
              </div>
            </motion.div>
          ))}
        </div>
      </ChartCard>

      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Planned vs Actual Capex Spend" subtitle="Monthly comparison (PKR M)">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.spendTrend}>
              <defs>
                <linearGradient id="capexActualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="planned" name="Planned" stroke="hsl(var(--primary))" strokeWidth={2} strokeDasharray="6 4" dot={false} />
              <Area type="monotone" dataKey="actual" name="Actual" stroke="hsl(var(--destructive))" fill="url(#capexActualGrad)" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Annual Depreciation by Asset Class" subtitle="Yearly writedown (PKR M)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.depreciation} barSize={28}>
              <defs>
                <linearGradient id="depGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis dataKey="category" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="value" name="Depreciation" fill="url(#depGrad)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
