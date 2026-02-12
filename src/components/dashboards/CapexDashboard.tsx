import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CAPEX_DATA } from '@/data/dummyDashboardData';
import { Progress } from '@/components/ui/progress';

export function CapexDashboard() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">Capital Projects</h3>
        <div className="space-y-4">
          {CAPEX_DATA.projects.map(p => (
            <div key={p.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-card-foreground">{p.name}</span>
                <span className="text-muted-foreground">PKR {p.spent}M / {p.budget}M</span>
              </div>
              <Progress value={p.progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">{p.progress}% complete</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">Annual Depreciation by Category (PKR M)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={CAPEX_DATA.depreciation}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="category" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
            <Bar dataKey="value" name="Depreciation" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
