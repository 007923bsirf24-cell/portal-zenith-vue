import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AP_DATA } from '@/data/dummyDashboardData';
import { cn } from '@/lib/utils';

export function APDashboard() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">AP Aging Buckets (PKR M)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={AP_DATA.aging}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="bucket" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
            <Bar dataKey="amount" name="Amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">Upcoming Payments</h3>
        <div className="divide-y divide-border">
          {AP_DATA.upcoming.map(p => (
            <div key={p.vendor} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-sm text-card-foreground">{p.vendor}</p>
                <p className="text-xs text-muted-foreground">Due: {p.due}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm text-card-foreground">{p.amount}</p>
                <span className={cn(
                  'text-xs font-medium',
                  p.status === 'Due Soon' ? 'text-destructive' : 'text-muted-foreground'
                )}>{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
