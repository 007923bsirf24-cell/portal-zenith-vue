import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BUDGET_DATA } from '@/data/dummyDashboardData';
import { KpiCard, ChartCard, TableCard, ProgressRing } from './KpiCard';
import { DashboardFilters, useDashboardFilters } from './DashboardFilters';
import { Wallet, TrendingUp, AlertTriangle, PieChart as PieIcon } from 'lucide-react';

const TOOLTIP_STYLE = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12, boxShadow: '0 8px 32px hsl(0 0% 0% / 0.12)' };
const KPI_ICONS = [<Wallet size={18} />, <TrendingUp size={18} />, <AlertTriangle size={18} />, <PieIcon size={18} />];

export function BudgetDashboard() {
  const { campus, setCampus, year, setYear, quarter, setQuarter, activeCampus } = useDashboardFilters();
  const data = BUDGET_DATA[activeCampus];
  const utilization = parseFloat(data.summary[3]?.value) || 0;

  return (
    <div className="space-y-6">
      <DashboardFilters campus={campus} setCampus={setCampus} year={year} setYear={setYear} showQuarter quarter={quarter} setQuarter={setQuarter} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {data.summary.map((k, i) => <KpiCard key={k.label} {...k} icon={KPI_ICONS[i]} />)}
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <ChartCard title="Budget vs Actual by Department" subtitle="Grouped comparison (PKR M)" className="lg:col-span-3">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data.byDepartment} barGap={4}>
              <defs>
                <linearGradient id="budgetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis dataKey="dept" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
              <Bar dataKey="budget" name="Budget" fill="url(#budgetGrad)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="actual" name="Actual" fill="url(#actualGrad)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Budget Utilization" subtitle="Overall progress" className="lg:col-span-2 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center py-4">
            <ProgressRing value={Math.min(utilization, 100)} size={160} strokeWidth={14} label="of total budget utilized" color={utilization > 100 ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'} />
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Monthly Budget vs Actual Trend" subtitle="Tracking over academic year (PKR M)">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data.monthlyTrend}>
            <defs>
              <linearGradient id="budgetLineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
            <Line type="monotone" dataKey="budget" name="Budget" stroke="hsl(var(--primary))" strokeWidth={2} strokeDasharray="6 4" dot={false} />
            <Line type="monotone" dataKey="actual" name="Actual" stroke="url(#budgetLineGrad)" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <TableCard
        title="Department Variance Detail"
        headers={['Department', 'Budget (PKR M)', 'Actual (PKR M)', 'Variance', '% Utilized']}
        rows={data.byDepartment.map(d => {
          const variance = d.actual - d.budget;
          const pct = ((d.actual / d.budget) * 100).toFixed(1);
          return [
            d.dept,
            d.budget.toFixed(1),
            d.actual.toFixed(1),
            <span className={variance > 0 ? 'text-destructive font-semibold' : 'text-emerald-600 dark:text-emerald-400 font-semibold'}>
              {variance > 0 ? `+${variance.toFixed(1)}` : variance.toFixed(1)}
            </span>,
            <span className={parseFloat(pct) > 100 ? 'text-destructive font-semibold' : ''}>{pct}%</span>,
          ];
        })}
      />
    </div>
  );
}
