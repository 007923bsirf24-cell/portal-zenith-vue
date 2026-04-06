import { BarChart, Bar, PieChart, Pie, Cell, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { VENDOR_DATA } from '@/data/vendorData';
import { MONTHS } from '@/data/dummyDashboardData';
import { KpiCard, ChartCard, StatusBadge } from './KpiCard';
import { DashboardFilters, useDashboardFilters } from './DashboardFilters';
import { Users, DollarSign, AlertTriangle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { DownloadButtons } from './DownloadButtons';
import { useState } from 'react';

const AGING_COLORS = ['hsl(142, 71%, 45%)', 'hsl(var(--primary))', 'hsl(45, 93%, 47%)', 'hsl(25, 95%, 53%)', 'hsl(var(--destructive))'];
const PIE_COLORS = ['hsl(var(--primary))', 'hsl(199, 89%, 48%)', 'hsl(142, 71%, 45%)', 'hsl(45, 93%, 47%)', 'hsl(280, 67%, 55%)', 'hsl(var(--destructive))', 'hsl(25, 95%, 53%)', 'hsl(320, 60%, 50%)'];
const TOOLTIP_STYLE = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12, boxShadow: '0 8px 32px hsl(0 0% 0% / 0.12)' };
const KPI_ICONS = [<Users size={18} />, <DollarSign size={18} />, <AlertTriangle size={18} />, <Clock size={18} />];

function fmt(n: number) {
  return n ? n.toLocaleString() : '—';
}

export function VendorDashboard() {
  const { campus, setCampus, year, setYear, activeCampus } = useDashboardFilters();
  const data = VENDOR_DATA[activeCampus];
  const [movementView, setMovementView] = useState<'debit' | 'credit'>('debit');

  const downloadData = {
    title: 'Vendor Payable Report',
    campus: activeCampus,
    sections: [
      {
        title: 'Vendor Balances',
        headers: ['ID', 'Vendor', 'Category', 'Balance (PKR M)', 'Current', '1-30 Days', '31-60 Days', '61-90 Days', '90+ Days'],
        rows: data.vendors.map(v => [v.id, v.name, v.category, v.balance, v.current, v.days30, v.days60, v.days90, '-']),
      },
      {
        title: 'Vendor Month-on-Month Movement (Debits)',
        headers: ['Vendor', 'Opening Bal', ...MONTHS.map(m => `${m} Debit`), 'Total Debits', 'Total Credits', 'Closing Bal'],
        rows: data.vendorMovement.map(v => [v.name, v.openingBalance, ...v.monthlyDebits, v.totalDebits, v.totalCredits, v.closingBalance]),
      },
      {
        title: 'Vendor Month-on-Month Movement (Credits)',
        headers: ['Vendor', 'Opening Bal', ...MONTHS.map(m => `${m} Credit`), 'Total Debits', 'Total Credits', 'Closing Bal'],
        rows: data.vendorMovement.map(v => [v.name, v.openingBalance, ...v.monthlyCredits, v.totalDebits, v.totalCredits, v.closingBalance]),
      },
      {
        title: 'Payment Schedule',
        headers: ['Vendor', 'Invoice', 'Amount', 'Due Date', 'Priority'],
        rows: data.paymentSchedule.map(p => [p.vendor, p.invoiceNo, p.amount, p.dueDate, p.priority]),
      },
    ],
  };

  const movementTotals = {
    openingBalance: data.vendorMovement.reduce((s, v) => s + v.openingBalance, 0),
    monthlyValues: MONTHS.map((_, mi) =>
      data.vendorMovement.reduce((s, v) => s + (movementView === 'debit' ? v.monthlyDebits[mi] : v.monthlyCredits[mi]), 0)
    ),
    totalDebits: data.vendorMovement.reduce((s, v) => s + v.totalDebits, 0),
    totalCredits: data.vendorMovement.reduce((s, v) => s + v.totalCredits, 0),
    closingBalance: data.vendorMovement.reduce((s, v) => s + v.closingBalance, 0),
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

      {/* Vendor Balance Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-5 sm:p-6">
        <h3 className="text-sm font-bold text-card-foreground mb-5">Vendor Payable Balances</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-border">
                {['Code', 'Vendor Name', 'Category', 'Balance', 'Current', '1-30D', '31-60D', '61-90D'].map(h => (
                  <th key={h} className="text-left py-3 px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.vendors.map((v, i) => (
                <motion.tr key={v.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border/50 hover:bg-primary/[0.03] transition-colors"
                >
                  <td className="py-2.5 px-2 font-mono text-xs text-muted-foreground">{v.id}</td>
                  <td className="py-2.5 px-2 font-semibold text-card-foreground">{v.name}</td>
                  <td className="py-2.5 px-2 text-xs text-muted-foreground">{v.category}</td>
                  <td className="py-2.5 px-2 font-bold text-card-foreground">{v.balance}</td>
                  <td className="py-2.5 px-2 text-emerald-600 dark:text-emerald-400 font-medium">{v.current || '—'}</td>
                  <td className="py-2.5 px-2 text-amber-600 dark:text-amber-400 font-medium">{v.days30 || '—'}</td>
                  <td className="py-2.5 px-2 text-orange-600 dark:text-orange-400 font-medium">{v.days60 || '—'}</td>
                  <td className="py-2.5 px-2 text-destructive font-medium">{v.days90 || '—'}</td>
                </motion.tr>
              ))}
              <tr className="border-t-4 border-primary/30 bg-primary/10">
                <td colSpan={3} className="py-2.5 px-2 font-bold text-card-foreground">TOTAL</td>
                <td className="py-2.5 px-2 font-bold text-card-foreground">{data.vendors.reduce((s, v) => s + v.balance, 0).toFixed(1)}</td>
                <td className="py-2.5 px-2 font-bold text-emerald-600">{data.vendors.reduce((s, v) => s + v.current, 0).toFixed(1)}</td>
                <td className="py-2.5 px-2 font-bold text-amber-600">{data.vendors.reduce((s, v) => s + v.days30, 0).toFixed(1)}</td>
                <td className="py-2.5 px-2 font-bold text-orange-600">{data.vendors.reduce((s, v) => s + v.days60, 0).toFixed(1)}</td>
                <td className="py-2.5 px-2 font-bold text-destructive">{data.vendors.reduce((s, v) => s + v.days90, 0).toFixed(1)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Vendor Month-on-Month Movement — like Excel screenshot */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-sm font-bold text-card-foreground">Vendor Month-on-Month Movement</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Opening Balance → Monthly {movementView === 'debit' ? 'Debits' : 'Credits'} → Totals → Closing Balance</p>
          </div>
          <div className="flex rounded-lg border border-border overflow-hidden text-xs">
            <button
              onClick={() => setMovementView('debit')}
              className={`px-3 py-1.5 font-medium transition-colors ${movementView === 'debit' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'}`}
            >
              Debits
            </button>
            <button
              onClick={() => setMovementView('credit')}
              className={`px-3 py-1.5 font-medium transition-colors ${movementView === 'credit' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'}`}
            >
              Credits
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b-2 border-primary/30 bg-primary/5">
                <th className="text-left py-2.5 px-2 text-[10px] font-bold text-card-foreground uppercase tracking-wider sticky left-0 bg-primary/5 z-10 min-w-[180px]">Vendor Name</th>
                <th className="text-right py-2.5 px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider min-w-[90px]">Opening Bal</th>
                {MONTHS.map(month => (
                  <th key={month} className="text-right py-2.5 px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider min-w-[85px]">
                    {month} {movementView === 'debit' ? 'Dr' : 'Cr'}
                  </th>
                ))}
                <th className="text-right py-2.5 px-2 text-[10px] font-bold text-primary uppercase tracking-wider min-w-[95px]">Total Debits</th>
                <th className="text-right py-2.5 px-2 text-[10px] font-bold text-emerald-600 uppercase tracking-wider min-w-[95px]">Total Credits</th>
                <th className="text-right py-2.5 px-2 text-[10px] font-bold text-card-foreground uppercase tracking-wider min-w-[95px]">Closing Bal</th>
              </tr>
            </thead>
            <tbody>
              {data.vendorMovement.map((v, i) => (
                <tr key={i} className="border-b border-border/40 hover:bg-primary/[0.02] transition-colors">
                  <td className="py-2 px-2 font-semibold text-card-foreground sticky left-0 bg-card z-10">{v.name}</td>
                  <td className="py-2 px-2 text-right font-mono text-muted-foreground">{fmt(v.openingBalance)}</td>
                  {(movementView === 'debit' ? v.monthlyDebits : v.monthlyCredits).map((val, mi) => (
                    <td key={mi} className={`py-2 px-2 text-right font-mono ${val ? 'text-card-foreground' : 'text-muted-foreground/40'}`}>
                      {fmt(val)}
                    </td>
                  ))}
                  <td className="py-2 px-2 text-right font-mono font-bold text-primary">{fmt(v.totalDebits)}</td>
                  <td className="py-2 px-2 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">{fmt(v.totalCredits)}</td>
                  <td className={`py-2 px-2 text-right font-mono font-bold ${v.closingBalance < 0 ? 'text-destructive' : 'text-card-foreground'}`}>
                    {v.closingBalance < 0 ? `(${fmt(Math.abs(v.closingBalance))})` : fmt(v.closingBalance)}
                  </td>
                </tr>
              ))}
              {/* Totals row */}
              <tr className="border-t-4 border-primary/30 bg-primary/10 font-bold">
                <td className="py-2.5 px-2 text-card-foreground sticky left-0 bg-primary/10 z-10">TOTAL</td>
                <td className="py-2.5 px-2 text-right font-mono text-card-foreground">{fmt(movementTotals.openingBalance)}</td>
                {movementTotals.monthlyValues.map((val, mi) => (
                  <td key={mi} className="py-2.5 px-2 text-right font-mono text-card-foreground">{fmt(val)}</td>
                ))}
                <td className="py-2.5 px-2 text-right font-mono text-primary">{fmt(movementTotals.totalDebits)}</td>
                <td className="py-2.5 px-2 text-right font-mono text-emerald-600">{fmt(movementTotals.totalCredits)}</td>
                <td className="py-2.5 px-2 text-right font-mono text-card-foreground">{fmt(movementTotals.closingBalance)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Monthly Payable Movement" subtitle="Opening → Invoices → Payments → Closing (PKR M)">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data.monthlyMovement}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
              <Bar dataKey="invoices" name="Invoices Raised" fill="hsl(var(--destructive))" radius={[8, 8, 0, 0]} barSize={20} fillOpacity={0.7} />
              <Bar dataKey="payments" name="Payments Made" fill="hsl(142, 71%, 45%)" radius={[8, 8, 0, 0]} barSize={20} fillOpacity={0.7} />
              <Line type="monotone" dataKey="closing" name="Closing Balance" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Aging Summary" subtitle="Payable amounts by aging bucket (PKR M)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.agingSummary} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis dataKey="bucket" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="amount" name="Amount">
                {data.agingSummary.map((_, i) => <Cell key={i} fill={AGING_COLORS[i]} radius={[8, 8, 0, 0] as any} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <ChartCard title="Spend by Category" subtitle="Vendor category distribution" className="lg:col-span-1">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.categoryBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2} dataKey="value"
                label={({ name, value }) => `${name} ${value}%`}>
                {data.categoryBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Payment Schedule */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-5 sm:p-6 lg:col-span-2">
          <h3 className="text-sm font-bold text-card-foreground mb-5">Upcoming Payment Schedule</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-border">
                  {['Vendor', 'Invoice #', 'Amount', 'Due Date', 'Priority'].map(h => (
                    <th key={h} className="text-left py-3 px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.paymentSchedule.map((p, i) => (
                  <motion.tr key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/50 hover:bg-primary/[0.03] transition-colors"
                  >
                    <td className="py-2.5 px-3 font-semibold text-card-foreground">{p.vendor}</td>
                    <td className="py-2.5 px-3 font-mono text-xs text-muted-foreground">{p.invoiceNo}</td>
                    <td className="py-2.5 px-3 font-bold text-card-foreground">{p.amount}</td>
                    <td className="py-2.5 px-3 text-muted-foreground">{p.dueDate}</td>
                    <td className="py-2.5 px-3"><StatusBadge status={p.priority} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
