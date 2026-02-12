import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CAPEX_DATA } from '@/data/dummyDashboardData';
import { KpiCard, ChartCard } from './KpiCard';
import { DashboardFilters, useDashboardFilters } from './DashboardFilters';
import { Progress } from '@/components/ui/progress';

const TOOLTIP_STYLE = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 };

export function CapexDashboard() {
  const { campus, setCampus, year, setYear, activeCampus } = useDashboardFilters();
  const data = CAPEX_DATA[activeCampus];

  return (
    <div className="space-y-5">
      <DashboardFilters campus={campus} setCampus={setCampus} year={year} setYear={setYear} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {data.kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      <ChartCard title="Capital Projects Progress">
        <div className="space-y-5">
          {data.projects.map(p => (
            <div key={p.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-card-foreground">{p.name}</span>
                <span className="text-muted-foreground text-xs">PKR {p.spent}M / {p.budget}M ({p.progress}%)</span>
              </div>
              <Progress value={p.progress} className="h-2.5" />
            </div>
          ))}
        </div>
      </ChartCard>

      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Planned vs Actual Capex Spend (PKR M)">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.spendTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="planned" name="Planned" stroke="hsl(var(--primary))" strokeWidth={2} strokeDasharray="5 5" />
              <Line type="monotone" dataKey="actual" name="Actual" stroke="hsl(var(--destructive))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Annual Depreciation by Asset Class (PKR M)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.depreciation}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="category" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="value" name="Depreciation" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
