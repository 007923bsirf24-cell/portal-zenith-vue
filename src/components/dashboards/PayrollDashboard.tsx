import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PAYROLL_DATA } from '@/data/dummyDashboardData';

export function PayrollDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Payroll Cost by Department (PKR M)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={PAYROLL_DATA.byDept} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis dataKey="dept" type="category" width={100} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
              <Bar dataKey="cost" name="Cost (PKR M)" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Monthly Payroll Trend (PKR M)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={PAYROLL_DATA.trend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
              <Line type="monotone" dataKey="cost" name="Cost" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">Headcount by Department</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {PAYROLL_DATA.byDept.map(d => (
            <div key={d.dept} className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-card-foreground">{d.headcount}</p>
              <p className="text-xs text-muted-foreground mt-1">{d.dept}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
