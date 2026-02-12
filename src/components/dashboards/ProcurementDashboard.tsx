import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PROCUREMENT_DATA } from '@/data/dummyDashboardData';
import { KpiCard, ChartCard, TableCard, StatusBadge } from './KpiCard';
import { DashboardFilters, useDashboardFilters } from './DashboardFilters';
import { Star } from 'lucide-react';

const PIE_COLORS = ['hsl(var(--primary))', 'hsl(var(--muted-foreground))', 'hsl(var(--destructive))', 'hsl(var(--accent-foreground))', 'hsl(var(--secondary-foreground))'];
const TOOLTIP_STYLE = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 };

export function ProcurementDashboard() {
  const { campus, setCampus, year, setYear, activeCampus } = useDashboardFilters();
  const data = PROCUREMENT_DATA[activeCampus];

  return (
    <div className="space-y-5">
      <DashboardFilters campus={campus} setCampus={setCampus} year={year} setYear={setYear} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {data.kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Spend by Category (PKR M)">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.byCategory} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={3} label={({ name, value }) => `${name}: ${value}M`} style={{ fontSize: 10 }}>
                {data.byCategory.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Procurement Spend (PKR M)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.monthlySpend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="spend" name="Spend" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <TableCard
        title="Vendor Performance"
        headers={['Vendor', 'Spend', 'Orders', 'Rating', 'On-Time %']}
        rows={data.vendors.map(v => [
          v.vendor,
          v.spend,
          v.orders.toString(),
          <span className="flex items-center gap-1"><Star size={11} className="fill-primary text-primary" /> {v.rating}</span>,
          `${v.onTime}%`,
        ])}
      />
    </div>
  );
}
