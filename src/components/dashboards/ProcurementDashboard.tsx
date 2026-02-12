import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { PROCUREMENT_DATA } from '@/data/dummyDashboardData';
import { Star } from 'lucide-react';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted-foreground))', 'hsl(var(--destructive))', 'hsl(var(--accent-foreground))', 'hsl(var(--secondary-foreground))'];

export function ProcurementDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Spend by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={PROCUREMENT_DATA.byCategory} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                {PROCUREMENT_DATA.byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Top Vendors</h3>
          <div className="space-y-3">
            {PROCUREMENT_DATA.vendors.map(v => (
              <div key={v.vendor} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-sm text-card-foreground">{v.vendor}</p>
                  <p className="text-xs text-muted-foreground">{v.orders} orders</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm text-card-foreground">PKR {v.spend}M</p>
                  <div className="flex items-center gap-0.5 justify-end">
                    <Star size={10} className="fill-primary text-primary" />
                    <span className="text-xs text-muted-foreground">{v.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
