import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AP_DATA } from '@/data/dummyDashboardData';
import { KpiCard, ChartCard, TableCard, StatusBadge } from './KpiCard';
import { DashboardFilters, useDashboardFilters } from './DashboardFilters';
import { FileText, AlertTriangle, Clock, Percent } from 'lucide-react';

const TOOLTIP_STYLE = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12, boxShadow: '0 8px 32px hsl(0 0% 0% / 0.12)' };
const KPI_ICONS = [<FileText size={18} />, <AlertTriangle size={18} />, <Clock size={18} />, <Percent size={18} />];

export function APDashboard() {
  const { campus, setCampus, year, setYear, activeCampus } = useDashboardFilters();
  const data = AP_DATA[activeCampus];

  return (
    <div className="space-y-6">
      <DashboardFilters campus={campus} setCampus={setCampus} year={year} setYear={setYear} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {data.kpis.map((k, i) => <KpiCard key={k.label} {...k} icon={KPI_ICONS[i]} />)}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="AP Aging Buckets" subtitle="Outstanding amounts (PKR M)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.aging} barSize={32}>
              <defs>
                <linearGradient id="apAgingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis dataKey="bucket" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="amount" name="Amount" fill="url(#apAgingGrad)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Payment Trend" subtitle="Paid vs due (PKR M)">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.paymentTrend}>
              <defs>
                <linearGradient id="apPaidGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="apDueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="paid" name="Paid" stroke="hsl(var(--primary))" fill="url(#apPaidGrad)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="due" name="Due" stroke="hsl(var(--destructive))" fill="url(#apDueGrad)" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <TableCard
        title="Upcoming Payments Schedule"
        headers={['Vendor', 'Amount', 'Due Date', 'Priority']}
        rows={data.upcoming.map(p => [
          <span className="font-semibold">{p.vendor}</span>,
          <span className="font-bold">{p.amount}</span>,
          p.due,
          <StatusBadge status={p.priority} />,
        ])}
      />
    </div>
  );
}
