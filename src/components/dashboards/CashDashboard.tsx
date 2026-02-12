import { ComposedChart, Bar, Line, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CASH_DATA } from '@/data/dummyDashboardData';
import { KpiCard, ChartCard, TableCard } from './KpiCard';
import { DashboardFilters, useDashboardFilters } from './DashboardFilters';

const TOOLTIP_STYLE = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 };

export function CashDashboard() {
  const { campus, setCampus, year, setYear, activeCampus } = useDashboardFilters();
  const data = CASH_DATA[activeCampus];

  return (
    <div className="space-y-5">
      <DashboardFilters campus={campus} setCampus={setCampus} year={year} setYear={setYear} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {data.kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      <ChartCard title="13-Week Cash Forecast (PKR M)">
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={data.forecast}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="week" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="inflow" name="Inflow" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
            <Bar dataKey="outflow" name="Outflow" fill="hsl(var(--destructive))" radius={[3, 3, 0, 0]} fillOpacity={0.7} />
            <Line type="monotone" dataKey="balance" name="Balance" stroke="hsl(var(--foreground))" strokeWidth={2.5} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Daily Cash Movements (PKR M) — Current Month">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.dailyMovements.slice(0, 15)}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="inflow" name="Inflow" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
              <Bar dataKey="outflow" name="Outflow" fill="hsl(var(--destructive))" radius={[3, 3, 0, 0]} fillOpacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <TableCard
          title="Bank Account Balances"
          headers={['Bank Account', 'Type', 'Balance']}
          rows={data.bankAccounts.map(b => [b.bank, b.type, b.balance])}
        />
      </div>
    </div>
  );
}
