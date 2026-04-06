import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PNL_DATA } from '@/data/pnlData';
import { KpiCard, ChartCard, TableCard } from './KpiCard';
import { DashboardFilters, useDashboardFilters } from './DashboardFilters';
import { DollarSign, TrendingUp, TrendingDown, Percent } from 'lucide-react';
import { motion } from 'framer-motion';
import { DownloadButtons } from './DownloadButtons';

const PIE_COLORS = ['hsl(var(--primary))', 'hsl(199, 89%, 48%)', 'hsl(var(--destructive))', 'hsl(45, 93%, 47%)', 'hsl(280, 67%, 55%)'];
const TOOLTIP_STYLE = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12, boxShadow: '0 8px 32px hsl(0 0% 0% / 0.12)' };
const KPI_ICONS = [<DollarSign size={18} />, <TrendingDown size={18} />, <TrendingUp size={18} />, <Percent size={18} />];

export function PnlDashboard() {
  const { campus, setCampus, year, setYear, activeCampus } = useDashboardFilters();
  const data = PNL_DATA[activeCampus];

  const downloadData = {
    title: 'Profit & Loss Statement',
    campus: activeCampus,
    sections: [
      {
        title: 'Revenue',
        headers: ['Account', 'Actual (PKR M)', 'Budget (PKR M)', 'Variance (PKR M)', '% Share'],
        rows: data.incomeStatement.map(r => [r.account, r.amount, r.budget, r.variance, `${r.pct}%`]),
      },
      {
        title: 'Expenses',
        headers: ['Account', 'Actual (PKR M)', 'Budget (PKR M)', 'Variance (PKR M)'],
        rows: data.expenses.map(r => [r.account, r.amount, r.budget, r.variance]),
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <DashboardFilters campus={campus} setCampus={setCampus} year={year} setYear={setYear} />
        <DownloadButtons data={downloadData} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {data.kpis.map((k, i) => <KpiCard key={k.label} {...k} icon={KPI_ICONS[i]} />)}
      </div>

      {/* Income Statement Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-5 sm:p-6">
        <h3 className="text-sm font-bold text-card-foreground mb-5">Income Statement</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-3 px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Account</th>
                <th className="text-right py-3 px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Actual (PKR M)</th>
                <th className="text-right py-3 px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Budget (PKR M)</th>
                <th className="text-right py-3 px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Variance</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-primary/5">
                <td colSpan={4} className="py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Revenue</td>
              </tr>
              {data.incomeStatement.map(r => (
                <tr key={r.account} className="border-b border-border/50 hover:bg-primary/[0.03] transition-colors">
                  <td className="py-2.5 px-3 font-medium text-card-foreground">{r.account}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-card-foreground">{r.amount}</td>
                  <td className="py-2.5 px-3 text-right text-muted-foreground">{r.budget}</td>
                  <td className={`py-2.5 px-3 text-right font-semibold ${r.variance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
                    {r.variance >= 0 ? '+' : ''}{r.variance}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-primary/20 bg-primary/5">
                <td className="py-2.5 px-3 font-bold text-card-foreground">Total Revenue</td>
                <td className="py-2.5 px-3 text-right font-bold text-card-foreground">{data.incomeStatement.reduce((s, r) => s + r.amount, 0).toFixed(1)}</td>
                <td className="py-2.5 px-3 text-right font-bold text-muted-foreground">{data.incomeStatement.reduce((s, r) => s + r.budget, 0).toFixed(1)}</td>
                <td className="py-2.5 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">+{data.incomeStatement.reduce((s, r) => s + r.variance, 0).toFixed(1)}</td>
              </tr>

              <tr className="bg-destructive/5">
                <td colSpan={4} className="py-2 px-3 text-xs font-bold text-destructive uppercase tracking-wider mt-4">Expenses</td>
              </tr>
              {data.expenses.map(r => (
                <tr key={r.account} className="border-b border-border/50 hover:bg-primary/[0.03] transition-colors">
                  <td className="py-2.5 px-3 font-medium text-card-foreground">{r.account}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-card-foreground">{r.amount}</td>
                  <td className="py-2.5 px-3 text-right text-muted-foreground">{r.budget}</td>
                  <td className={`py-2.5 px-3 text-right font-semibold ${r.variance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
                    {r.variance >= 0 ? '+' : ''}{r.variance}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-destructive/20 bg-destructive/5">
                <td className="py-2.5 px-3 font-bold text-card-foreground">Total Expenses</td>
                <td className="py-2.5 px-3 text-right font-bold text-card-foreground">{data.expenses.reduce((s, r) => s + r.amount, 0).toFixed(1)}</td>
                <td className="py-2.5 px-3 text-right font-bold text-muted-foreground">{data.expenses.reduce((s, r) => s + r.budget, 0).toFixed(1)}</td>
                <td className="py-2.5 px-3 text-right font-bold text-destructive">{data.expenses.reduce((s, r) => s + r.variance, 0).toFixed(1)}</td>
              </tr>

              <tr className="border-t-4 border-primary/30 bg-primary/10">
                <td className="py-3 px-3 font-bold text-lg text-card-foreground">Net Profit / (Loss)</td>
                <td className="py-3 px-3 text-right font-bold text-lg text-emerald-600 dark:text-emerald-400">
                  {(data.incomeStatement.reduce((s, r) => s + r.amount, 0) - data.expenses.reduce((s, r) => s + r.amount, 0)).toFixed(1)}
                </td>
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-5">
        <ChartCard title="Revenue vs Expenses vs Profit" subtitle="Monthly trend (PKR M)" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.monthlyTrend}>
              <defs>
                <linearGradient id="pnlRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pnlProfitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(var(--primary))" fill="url(#pnlRevGrad)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="hsl(var(--destructive))" fill="none" strokeWidth={2} strokeDasharray="5 5" />
              <Area type="monotone" dataKey="profit" name="Net Profit" stroke="hsl(142, 71%, 45%)" fill="url(#pnlProfitGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue by Stream" subtitle="Percentage breakdown">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.revenueByStream} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                {data.revenueByStream.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Margin Trends" subtitle="Gross, Operating & Net Margin (%)">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data.marginTrend}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 50]} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
            <Line type="monotone" dataKey="gross" name="Gross Margin" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="operating" name="Operating Margin" stroke="hsl(45, 93%, 47%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="net" name="Net Margin" stroke="hsl(142, 71%, 45%)" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
