import { ComposedChart, Bar, Line, BarChart, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CASH_DATA } from '@/data/dummyDashboardData';
import { KpiCard, ChartCard, TableCard } from './KpiCard';
import { DashboardFilters, useDashboardFilters } from './DashboardFilters';
import { Landmark, ArrowUpRight, ArrowDownRight, Shield } from 'lucide-react';

const TOOLTIP_STYLE = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12, boxShadow: '0 8px 32px hsl(0 0% 0% / 0.12)' };
const KPI_ICONS = [<Landmark size={18} />, <ArrowUpRight size={18} />, <ArrowDownRight size={18} />, <Shield size={18} />];

export function CashDashboard() {
  const { campus, setCampus, year, setYear, activeCampus } = useDashboardFilters();
  const data = CASH_DATA[activeCampus];

  return (
    <div className="space-y-6">
      <DashboardFilters campus={campus} setCampus={setCampus} year={year} setYear={setYear} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {data.kpis.map((k, i) => <KpiCard key={k.label} {...k} icon={KPI_ICONS[i]} />)}
      </div>

      <ChartCard title="13-Week Cash Forecast" subtitle="Inflow, outflow & projected balance (PKR M)">
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart data={data.forecast}>
            <defs>
              <linearGradient id="inflowCashGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="outflowCashGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--destructive))" />
                <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
            <XAxis dataKey="week" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
            <Bar dataKey="inflow" name="Inflow" fill="url(#inflowCashGrad)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="outflow" name="Outflow" fill="url(#outflowCashGrad)" radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="balance" name="Balance" stroke="hsl(var(--foreground))" strokeWidth={2.5} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Daily Cash Movements" subtitle="Current month (PKR M)">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data.dailyMovements.slice(0, 15)}>
              <defs>
                <linearGradient id="dailyIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="dailyOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="inflow" name="Inflow" stroke="hsl(var(--primary))" fill="url(#dailyIn)" strokeWidth={2} />
              <Area type="monotone" dataKey="outflow" name="Outflow" stroke="hsl(var(--destructive))" fill="url(#dailyOut)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <TableCard
          title="Bank Account Balances"
          headers={['Bank Account', 'Type', 'Balance']}
          rows={data.bankAccounts.map(b => [
            <span className="font-semibold">{b.bank}</span>,
            <span className="text-muted-foreground">{b.type}</span>,
            <span className="font-bold text-primary">{b.balance}</span>,
          ])}
        />
      </div>
    </div>
  );
}
