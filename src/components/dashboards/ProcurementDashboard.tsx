import { PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PROCUREMENT_DATA } from '@/data/dummyDashboardData';
import { KpiCard, ChartCard, TableCard, StatusBadge } from './KpiCard';
import { DashboardFilters, useDashboardFilters } from './DashboardFilters';
import { Star, ShoppingCart, Package, Clock, Coins } from 'lucide-react';

const PIE_COLORS = ['hsl(var(--primary))', 'hsl(199, 89%, 48%)', 'hsl(var(--destructive))', 'hsl(45, 93%, 47%)', 'hsl(280, 67%, 55%)'];
const TOOLTIP_STYLE = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12, boxShadow: '0 8px 32px hsl(0 0% 0% / 0.12)' };
const KPI_ICONS = [<ShoppingCart size={18} />, <Package size={18} />, <Clock size={18} />, <Coins size={18} />];

export function ProcurementDashboard() {
  const { campus, setCampus, year, setYear, activeCampus } = useDashboardFilters();
  const data = PROCUREMENT_DATA[activeCampus];

  return (
    <div className="space-y-6">
      <DashboardFilters campus={campus} setCampus={setCampus} year={year} setYear={setYear} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {data.kpis.map((k, i) => <KpiCard key={k.label} {...k} icon={KPI_ICONS[i]} />)}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Spend by Category" subtitle="Distribution (PKR M)">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.byCategory} cx="50%" cy="45%" innerRadius={60} outerRadius={95} dataKey="value" paddingAngle={4} cornerRadius={6} label={({ name, value }) => `${name}: ${value}M`} style={{ fontSize: 9, fontWeight: 600 }}>
                {data.byCategory.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Procurement Spend" subtitle="Trend over time (PKR M)">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.monthlySpend}>
              <defs>
                <linearGradient id="procSpendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="spend" name="Spend" stroke="hsl(var(--primary))" fill="url(#procSpendGrad)" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <TableCard
        title="Vendor Performance"
        headers={['Vendor', 'Spend', 'Orders', 'Rating', 'On-Time %']}
        rows={data.vendors.map(v => [
          <span className="font-semibold">{v.vendor}</span>,
          v.spend,
          v.orders.toString(),
          <span className="flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400" /> {v.rating}</span>,
          <div className="flex items-center gap-2">
            <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${v.onTime}%` }} />
            </div>
            <span>{v.onTime}%</span>
          </div>,
        ])}
      />
    </div>
  );
}
