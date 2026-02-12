import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BUDGET_DATA } from '@/data/dummyDashboardData';
import { KpiCard, ChartCard, TableCard } from './KpiCard';
import { DashboardFilters, useDashboardFilters } from './DashboardFilters';

const TOOLTIP_STYLE = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 };

export function BudgetDashboard() {
  const { campus, setCampus, year, setYear, quarter, setQuarter, activeCampus } = useDashboardFilters();
  const data = BUDGET_DATA[activeCampus];

  return (
    <div className="space-y-5">
      <DashboardFilters campus={campus} setCampus={setCampus} year={year} setYear={setYear} showQuarter quarter={quarter} setQuarter={setQuarter} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {data.summary.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Budget vs Actual by Department (PKR M)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.byDepartment}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="dept" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="budget" name="Budget" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" name="Actual" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Budget vs Actual Trend (PKR M)">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="budget" name="Budget" stroke="hsl(var(--primary))" strokeWidth={2} strokeDasharray="5 5" />
              <Line type="monotone" dataKey="actual" name="Actual" stroke="hsl(var(--destructive))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <TableCard
        title="Department Variance Detail"
        headers={['Department', 'Budget (PKR M)', 'Actual (PKR M)', 'Variance', '% Utilized']}
        rows={data.byDepartment.map(d => [
          d.dept,
          d.budget.toFixed(1),
          d.actual.toFixed(1),
          (d.actual - d.budget) > 0 ? `+${(d.actual - d.budget).toFixed(1)}` : (d.actual - d.budget).toFixed(1),
          `${((d.actual / d.budget) * 100).toFixed(1)}%`,
        ])}
      />
    </div>
  );
}
