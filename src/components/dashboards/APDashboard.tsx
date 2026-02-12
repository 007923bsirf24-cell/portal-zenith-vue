import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AP_DATA } from '@/data/dummyDashboardData';
import { KpiCard, ChartCard, TableCard, StatusBadge } from './KpiCard';
import { DashboardFilters, useDashboardFilters } from './DashboardFilters';

const TOOLTIP_STYLE = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 };

export function APDashboard() {
  const { campus, setCampus, year, setYear, activeCampus } = useDashboardFilters();
  const data = AP_DATA[activeCampus];

  return (
    <div className="space-y-5">
      <DashboardFilters campus={campus} setCampus={setCampus} year={year} setYear={setYear} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {data.kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="AP Aging Buckets (PKR M)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.aging}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="bucket" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="amount" name="Amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Payment Trend (PKR M)">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.paymentTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="paid" name="Paid" stroke="hsl(var(--primary))" strokeWidth={2} />
              <Line type="monotone" dataKey="due" name="Due" stroke="hsl(var(--destructive))" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <TableCard
        title="Upcoming Payments Schedule"
        headers={['Vendor', 'Amount', 'Due Date', 'Priority']}
        rows={data.upcoming.map(p => [
          p.vendor,
          p.amount,
          p.due,
          <StatusBadge status={p.priority} />,
        ])}
      />
    </div>
  );
}
