import { MONTHS, CAMPUSES } from './dummyDashboardData';

const CAMPUS_MULTIPLIERS: Record<string, number> = {
  Islamabad: 1.0, Lahore: 1.15, Karachi: 1.25, Peshawar: 0.7, Multan: 0.6,
};
function m(campus: string, base: number) {
  return +(base * (CAMPUS_MULTIPLIERS[campus] || 1)).toFixed(1);
}
function perCampus<T>(gen: (c: string) => T): Record<string, T> {
  const r: Record<string, T> = {};
  CAMPUSES.filter(c => c !== 'All Campuses').forEach(c => { r[c] = gen(c); });
  return r;
}

export const PNL_DATA = perCampus(campus => ({
  kpis: [
    { label: 'Total Revenue', value: `PKR ${m(campus, 95.4)}M`, change: '+14.2%', positive: true },
    { label: 'Total Expenses', value: `PKR ${m(campus, 72.8)}M`, change: '+8.5%', positive: false },
    { label: 'Net Profit', value: `PKR ${m(campus, 22.6)}M`, change: '+28.1%', positive: true },
    { label: 'Net Margin', value: '23.7%', change: '+2.8%', positive: true },
  ],
  incomeStatement: [
    { account: 'Tuition Fees', amount: m(campus, 58.2), budget: m(campus, 55.0), variance: m(campus, 3.2), pct: 61 },
    { account: 'Transport Fees', amount: m(campus, 11.4), budget: m(campus, 12.0), variance: m(campus, -0.6), pct: 12 },
    { account: 'Hostel Fees', amount: m(campus, 9.5), budget: m(campus, 9.0), variance: m(campus, 0.5), pct: 10 },
    { account: 'Exam Fees', amount: m(campus, 7.6), budget: m(campus, 7.5), variance: m(campus, 0.1), pct: 8 },
    { account: 'Other Income', amount: m(campus, 8.7), budget: m(campus, 7.0), variance: m(campus, 1.7), pct: 9 },
  ],
  expenses: [
    { account: 'Teaching Salaries', amount: m(campus, 32.5), budget: m(campus, 30.0), variance: m(campus, -2.5) },
    { account: 'Admin Salaries', amount: m(campus, 8.4), budget: m(campus, 8.0), variance: m(campus, -0.4) },
    { account: 'Utilities & Rent', amount: m(campus, 7.2), budget: m(campus, 7.5), variance: m(campus, 0.3) },
    { account: 'Academic Supplies', amount: m(campus, 5.8), budget: m(campus, 6.0), variance: m(campus, 0.2) },
    { account: 'Transport Costs', amount: m(campus, 6.5), budget: m(campus, 6.2), variance: m(campus, -0.3) },
    { account: 'Depreciation', amount: m(campus, 4.2), budget: m(campus, 4.0), variance: m(campus, -0.2) },
    { account: 'Marketing & Events', amount: m(campus, 3.1), budget: m(campus, 3.5), variance: m(campus, 0.4) },
    { account: 'IT & Software', amount: m(campus, 2.8), budget: m(campus, 3.0), variance: m(campus, 0.2) },
    { account: 'Maintenance', amount: m(campus, 2.3), budget: m(campus, 2.5), variance: m(campus, 0.2) },
  ],
  monthlyTrend: MONTHS.map((month, i) => ({
    month,
    revenue: m(campus, 7.5 + Math.sin(i * 0.5) * 1.5 + i * 0.2),
    expenses: m(campus, 5.8 + Math.cos(i * 0.4) * 0.8 + i * 0.1),
    profit: m(campus, 1.7 + Math.sin(i * 0.5) * 0.7 + i * 0.1),
  })),
  revenueByStream: [
    { name: 'Tuition Fees', value: 61 },
    { name: 'Transport', value: 12 },
    { name: 'Hostel', value: 10 },
    { name: 'Exam Fees', value: 8 },
    { name: 'Other', value: 9 },
  ],
  marginTrend: MONTHS.map((month, i) => ({
    month,
    gross: 38 + Math.sin(i * 0.6) * 3,
    operating: 26 + Math.sin(i * 0.5) * 2,
    net: 22 + Math.sin(i * 0.4) * 2.5,
  })),
}));
