import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TRIAL_BALANCE_DATA } from '@/data/trialBalanceData';
import { KpiCard, ChartCard } from './KpiCard';
import { DashboardFilters, useDashboardFilters } from './DashboardFilters';
import { BookOpen, Scale, AlertTriangle, Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { DownloadButtons } from './DownloadButtons';

const TYPE_COLORS: Record<string, string> = {
  Asset: 'hsl(var(--primary))',
  Liability: 'hsl(var(--destructive))',
  Equity: 'hsl(280, 67%, 55%)',
  Revenue: 'hsl(142, 71%, 45%)',
  Expense: 'hsl(45, 93%, 47%)',
};
const TOOLTIP_STYLE = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12, boxShadow: '0 8px 32px hsl(0 0% 0% / 0.12)' };
const KPI_ICONS = [<BookOpen size={18} />, <Scale size={18} />, <Hash size={18} />, <AlertTriangle size={18} />];

export function TrialBalanceDashboard() {
  const { campus, setCampus, year, setYear, activeCampus } = useDashboardFilters();
  const data = TRIAL_BALANCE_DATA[activeCampus];
  const [filterType, setFilterType] = useState<string>('All');

  const filteredRows = filterType === 'All' ? data.rows : data.rows.filter(r => r.type === filterType);
  const totalDebit = filteredRows.reduce((s, r) => s + r.debit, 0);
  const totalCredit = filteredRows.reduce((s, r) => s + r.credit, 0);

  const downloadData = {
    title: 'Trial Balance',
    campus: activeCampus,
    sections: [{
      title: 'Trial Balance',
      headers: ['Code', 'Account', 'Type', 'Debit (PKR M)', 'Credit (PKR M)'],
      rows: data.rows.map(r => [r.code, r.account, r.type, r.debit || '-', r.credit || '-']),
    }],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <DashboardFilters campus={campus} setCampus={setCampus} year={year} setYear={setYear}
          extra={
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="h-8 px-3 text-xs rounded-lg border border-border/60 bg-background/50 text-foreground"
            >
              <option value="All">All Types</option>
              <option value="Asset">Assets</option>
              <option value="Liability">Liabilities</option>
              <option value="Equity">Equity</option>
              <option value="Revenue">Revenue</option>
              <option value="Expense">Expenses</option>
            </select>
          }
        />
        <DownloadButtons data={downloadData} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {data.kpis.map((k, i) => <KpiCard key={k.label} {...k} icon={KPI_ICONS[i]} />)}
      </div>

      {/* Trial Balance Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-5 sm:p-6">
        <h3 className="text-sm font-bold text-card-foreground mb-5">Trial Balance — Period Ending {year}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-3 px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-20">Code</th>
                <th className="text-left py-3 px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Account</th>
                <th className="text-left py-3 px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-24">Type</th>
                <th className="text-right py-3 px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-32">Debit (PKR M)</th>
                <th className="text-right py-3 px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-32">Credit (PKR M)</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r, i) => {
                const prevType = i > 0 ? filteredRows[i - 1].type : null;
                const showHeader = r.type !== prevType;
                return (
                  <React.Fragment key={r.code}>
                    {showHeader && (
                      <tr>
                        <td colSpan={5} className="py-2 px-3 text-xs font-bold uppercase tracking-wider" style={{ color: TYPE_COLORS[r.type] }}>
                          <div className="flex items-center gap-2 pt-2">
                            <span className="w-2 h-2 rounded-full" style={{ background: TYPE_COLORS[r.type] }} />
                            {r.type === 'Asset' ? 'Assets' : r.type === 'Liability' ? 'Liabilities' : r.type + 's'}
                          </div>
                        </td>
                      </tr>
                    )}
                    <motion.tr
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02, duration: 0.3 }}
                      className="border-b border-border/50 hover:bg-primary/[0.03] transition-colors"
                    >
                      <td className="py-2 px-3 text-muted-foreground font-mono text-xs">{r.code}</td>
                      <td className="py-2 px-3 font-medium text-card-foreground">{r.account}</td>
                      <td className="py-2 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase" style={{ background: TYPE_COLORS[r.type] + '15', color: TYPE_COLORS[r.type] }}>
                          {r.type}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-card-foreground">{r.debit > 0 ? r.debit.toFixed(2) : '—'}</td>
                      <td className="py-2 px-3 text-right font-bold text-card-foreground">{r.credit > 0 ? r.credit.toFixed(2) : '—'}</td>
                    </motion.tr>
                  </React.Fragment>
                  </motion.tr>
                );
              })}
              <tr className="border-t-4 border-primary/30 bg-primary/10">
                <td colSpan={3} className="py-3 px-3 font-bold text-lg text-card-foreground">TOTAL</td>
                <td className="py-3 px-3 text-right font-bold text-lg text-card-foreground">{totalDebit.toFixed(2)}</td>
                <td className="py-3 px-3 text-right font-bold text-lg text-card-foreground">{totalCredit.toFixed(2)}</td>
              </tr>
              <tr className={`${Math.abs(totalDebit - totalCredit) < 0.01 ? 'bg-emerald-50 dark:bg-emerald-900/10' : 'bg-destructive/10'}`}>
                <td colSpan={3} className="py-2 px-3 font-semibold text-sm">
                  {Math.abs(totalDebit - totalCredit) < 0.01
                    ? '✓ Trial Balance is balanced'
                    : `⚠ Out of balance by PKR ${Math.abs(totalDebit - totalCredit).toFixed(2)}M`
                  }
                </td>
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Balance by Account Type" subtitle="Debit vs Credit distribution (PKR M)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.summary} layout="vertical" barSize={20}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="type" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="debit" name="Debit" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
              <Bar dataKey="credit" name="Credit" fill="hsl(var(--destructive))" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Account Type Distribution" subtitle="By total balance">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data.summary.map(s => ({ name: s.type, value: Math.max(s.debit, s.credit) }))}
                cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.summary.map((s) => <Cell key={s.type} fill={TYPE_COLORS[s.type]} />)}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
