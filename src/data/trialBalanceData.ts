import { CAMPUSES } from './dummyDashboardData';

const CAMPUS_MULTIPLIERS: Record<string, number> = {
  Islamabad: 1.0, Lahore: 1.15, Karachi: 1.25, Peshawar: 0.7, Multan: 0.6,
};
function m(campus: string, base: number) {
  return +(base * (CAMPUS_MULTIPLIERS[campus] || 1)).toFixed(2);
}
function perCampus<T>(gen: (c: string) => T): Record<string, T> {
  const r: Record<string, T> = {};
  CAMPUSES.filter(c => c !== 'All Campuses').forEach(c => { r[c] = gen(c); });
  return r;
}

export interface TrialBalanceRow {
  code: string;
  account: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  debit: number;
  credit: number;
}

export const TRIAL_BALANCE_DATA = perCampus(campus => ({
  kpis: [
    { label: 'Total Debits', value: `PKR ${m(campus, 185.6)}M` },
    { label: 'Total Credits', value: `PKR ${m(campus, 185.6)}M` },
    { label: 'GL Accounts', value: '156' },
    { label: 'Variance Flags', value: '3', positive: false, change: 'review' },
  ],
  rows: [
    { code: '1100', account: 'Cash & Bank Balances', type: 'Asset' as const, debit: m(campus, 17.5), credit: 0 },
    { code: '1200', account: 'Fee Receivables', type: 'Asset' as const, debit: m(campus, 8.2), credit: 0 },
    { code: '1300', account: 'Prepaid Expenses', type: 'Asset' as const, debit: m(campus, 3.1), credit: 0 },
    { code: '1400', account: 'Inventory — Supplies', type: 'Asset' as const, debit: m(campus, 1.8), credit: 0 },
    { code: '1500', account: 'Fixed Assets (Net)', type: 'Asset' as const, debit: m(campus, 65.4), credit: 0 },
    { code: '1600', account: 'Intangible Assets', type: 'Asset' as const, debit: m(campus, 2.5), credit: 0 },
    { code: '1700', account: 'Other Receivables', type: 'Asset' as const, debit: m(campus, 4.3), credit: 0 },
    { code: '2100', account: 'Accounts Payable', type: 'Liability' as const, debit: 0, credit: m(campus, 6.8) },
    { code: '2200', account: 'Accrued Expenses', type: 'Liability' as const, debit: 0, credit: m(campus, 4.5) },
    { code: '2300', account: 'Fee Received in Advance', type: 'Liability' as const, debit: 0, credit: m(campus, 5.2) },
    { code: '2400', account: 'Short-Term Borrowings', type: 'Liability' as const, debit: 0, credit: m(campus, 8.0) },
    { code: '2500', account: 'Tax Payable', type: 'Liability' as const, debit: 0, credit: m(campus, 2.1) },
    { code: '2600', account: 'Long-Term Loans', type: 'Liability' as const, debit: 0, credit: m(campus, 15.0) },
    { code: '3100', account: 'Share Capital', type: 'Equity' as const, debit: 0, credit: m(campus, 25.0) },
    { code: '3200', account: 'Retained Earnings', type: 'Equity' as const, debit: 0, credit: m(campus, 23.6) },
    { code: '4100', account: 'Tuition Fee Revenue', type: 'Revenue' as const, debit: 0, credit: m(campus, 58.2) },
    { code: '4200', account: 'Transport Revenue', type: 'Revenue' as const, debit: 0, credit: m(campus, 11.4) },
    { code: '4300', account: 'Hostel Revenue', type: 'Revenue' as const, debit: 0, credit: m(campus, 9.5) },
    { code: '4400', account: 'Other Revenue', type: 'Revenue' as const, debit: 0, credit: m(campus, 16.3) },
    { code: '5100', account: 'Teaching Salaries', type: 'Expense' as const, debit: m(campus, 32.5), credit: 0 },
    { code: '5200', account: 'Admin & Support Salaries', type: 'Expense' as const, debit: m(campus, 8.4), credit: 0 },
    { code: '5300', account: 'Utilities & Rent', type: 'Expense' as const, debit: m(campus, 7.2), credit: 0 },
    { code: '5400', account: 'Academic Supplies', type: 'Expense' as const, debit: m(campus, 5.8), credit: 0 },
    { code: '5500', account: 'Transport Expenses', type: 'Expense' as const, debit: m(campus, 6.5), credit: 0 },
    { code: '5600', account: 'Depreciation Expense', type: 'Expense' as const, debit: m(campus, 4.2), credit: 0 },
    { code: '5700', account: 'IT & Software', type: 'Expense' as const, debit: m(campus, 2.8), credit: 0 },
    { code: '5800', account: 'Marketing & Events', type: 'Expense' as const, debit: m(campus, 3.1), credit: 0 },
    { code: '5900', account: 'Maintenance & Repairs', type: 'Expense' as const, debit: m(campus, 2.3), credit: 0 },
  ],
  summary: [
    { type: 'Assets', debit: m(campus, 102.8), credit: 0 },
    { type: 'Liabilities', debit: 0, credit: m(campus, 41.6) },
    { type: 'Equity', debit: 0, credit: m(campus, 48.6) },
    { type: 'Revenue', debit: 0, credit: m(campus, 95.4) },
    { type: 'Expenses', debit: m(campus, 82.8), credit: 0 },
  ],
}));
