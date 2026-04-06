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

const VENDOR_NAMES = [
  'Oxford University Press', 'Pakistan Electric Co (IESCO)', 'Tech Solutions Ltd',
  'City Transport Services', 'Lab World International', 'Sui Northern Gas (SNGPL)',
  'Furniture Hub Pakistan', 'Office Pro Stationers', 'CleanPro Services', 'SecureGuard Pakistan',
  'Metro Pakistan Pvt. Ltd.', 'Copier Zone', 'Baba Buta Catering', 'Ebone Network (Pvt.) Ltd',
  'Cyber Internet Services', 'Ahmad Electric & Sanitary', 'National Electric Store',
  'Sajid Flour Mills (Pvt.) Ltd.', 'Sonu Aslam Steel Works', 'Total Parco Pakistan Pvt. Ltd',
];

function genVendorMovement(campus: string) {
  const mul = CAMPUS_MULTIPLIERS[campus] || 1;
  return VENDOR_NAMES.map((name, vi) => {
    const base = (50000 + vi * 18000) * mul;
    const openBal = +(base * (0.1 + Math.sin(vi) * 0.05)).toFixed(0);
    const monthlyDebits = MONTHS.map((_, mi) => {
      const val = base * (0.06 + Math.sin(vi + mi * 0.7) * 0.03);
      return +(val > 0 ? val : 0).toFixed(0);
    });
    const monthlyCredits = MONTHS.map((_, mi) => {
      const val = base * (0.055 + Math.cos(vi + mi * 0.5) * 0.025);
      return +(val > 0 ? val : 0).toFixed(0);
    });
    const totalDebits = monthlyDebits.reduce((s, v) => s + v, 0);
    const totalCredits = monthlyCredits.reduce((s, v) => s + v, 0);
    const closingBal = openBal + totalDebits - totalCredits;
    return {
      name,
      openingBalance: openBal,
      monthlyDebits,
      monthlyCredits,
      totalDebits,
      totalCredits,
      closingBalance: closingBal,
    };
  });
}

export const VENDOR_DATA = perCampus(campus => ({
  kpis: [
    { label: 'Total Vendors', value: `${Math.round(85 * (CAMPUS_MULTIPLIERS[campus] || 1))}` },
    { label: 'Total Payable', value: `PKR ${m(campus, 14.2)}M` },
    { label: 'Overdue Amount', value: `PKR ${m(campus, 2.8)}M`, positive: false, change: '+12%' },
    { label: 'Avg Payment Days', value: '24 days' },
  ],
  vendors: [
    { id: 'V001', name: 'Oxford University Press', category: 'Books & Materials', balance: m(campus, 3.2), current: m(campus, 1.8), days30: m(campus, 0.8), days60: m(campus, 0.4), days90: m(campus, 0.2), status: 'Active' },
    { id: 'V002', name: 'Pakistan Electric Co (IESCO)', category: 'Utilities', balance: m(campus, 1.5), current: m(campus, 1.5), days30: 0, days60: 0, days90: 0, status: 'Active' },
    { id: 'V003', name: 'Tech Solutions Ltd', category: 'IT Equipment', balance: m(campus, 2.1), current: m(campus, 1.2), days30: m(campus, 0.5), days60: m(campus, 0.3), days90: m(campus, 0.1), status: 'Active' },
    { id: 'V004', name: 'City Transport Services', category: 'Transport', balance: m(campus, 1.8), current: m(campus, 1.0), days30: m(campus, 0.5), days60: m(campus, 0.2), days90: m(campus, 0.1), status: 'Active' },
    { id: 'V005', name: 'Lab World International', category: 'Lab Equipment', balance: m(campus, 1.4), current: m(campus, 0.8), days30: m(campus, 0.4), days60: m(campus, 0.2), days90: 0, status: 'Active' },
    { id: 'V006', name: 'Sui Northern Gas (SNGPL)', category: 'Utilities', balance: m(campus, 0.8), current: m(campus, 0.8), days30: 0, days60: 0, days90: 0, status: 'Active' },
    { id: 'V007', name: 'Furniture Hub Pakistan', category: 'Furniture', balance: m(campus, 1.1), current: m(campus, 0.6), days30: m(campus, 0.3), days60: m(campus, 0.2), days90: 0, status: 'Active' },
    { id: 'V008', name: 'Office Pro Stationers', category: 'Stationery', balance: m(campus, 0.5), current: m(campus, 0.3), days30: m(campus, 0.1), days60: m(campus, 0.1), days90: 0, status: 'Active' },
    { id: 'V009', name: 'CleanPro Services', category: 'Cleaning & Janitorial', balance: m(campus, 0.6), current: m(campus, 0.4), days30: m(campus, 0.2), days60: 0, days90: 0, status: 'Active' },
    { id: 'V010', name: 'SecureGuard Pakistan', category: 'Security Services', balance: m(campus, 1.2), current: m(campus, 0.7), days30: m(campus, 0.3), days60: m(campus, 0.2), days90: 0, status: 'Active' },
  ],
  vendorMovement: genVendorMovement(campus),
  monthlyMovement: MONTHS.map((month, i) => ({
    month,
    opening: m(campus, 12 + Math.sin(i) * 2),
    invoices: m(campus, 4.5 + Math.sin(i * 0.7) * 1.2),
    payments: m(campus, 4.0 + Math.cos(i * 0.5) * 1.0),
    closing: m(campus, 12.5 + Math.sin(i + 1) * 2),
  })),
  agingSummary: [
    { bucket: 'Current', amount: m(campus, 8.1) },
    { bucket: '1-30 Days', amount: m(campus, 3.1) },
    { bucket: '31-60 Days', amount: m(campus, 1.6) },
    { bucket: '61-90 Days', amount: m(campus, 0.9) },
    { bucket: '90+ Days', amount: m(campus, 0.5) },
  ],
  paymentSchedule: [
    { vendor: 'Oxford University Press', amount: `PKR ${m(campus, 1.2)}M`, dueDate: '15 Jan 2026', priority: 'High', invoiceNo: 'INV-2025-1842' },
    { vendor: 'Tech Solutions Ltd', amount: `PKR ${m(campus, 0.8)}M`, dueDate: '20 Jan 2026', priority: 'Medium', invoiceNo: 'INV-2025-1756' },
    { vendor: 'Pakistan Electric Co', amount: `PKR ${m(campus, 1.5)}M`, dueDate: '25 Jan 2026', priority: 'High', invoiceNo: 'UTIL-2025-0145' },
    { vendor: 'City Transport Services', amount: `PKR ${m(campus, 0.6)}M`, dueDate: '28 Jan 2026', priority: 'Medium', invoiceNo: 'INV-2025-1901' },
    { vendor: 'Lab World International', amount: `PKR ${m(campus, 0.4)}M`, dueDate: '31 Jan 2026', priority: 'Low', invoiceNo: 'INV-2025-1678' },
    { vendor: 'CleanPro Services', amount: `PKR ${m(campus, 0.3)}M`, dueDate: '05 Feb 2026', priority: 'Low', invoiceNo: 'INV-2025-1955' },
    { vendor: 'SecureGuard Pakistan', amount: `PKR ${m(campus, 0.7)}M`, dueDate: '10 Feb 2026', priority: 'Medium', invoiceNo: 'INV-2025-1890' },
    { vendor: 'Sui Northern Gas', amount: `PKR ${m(campus, 0.4)}M`, dueDate: '15 Feb 2026', priority: 'High', invoiceNo: 'UTIL-2025-0146' },
  ],
  categoryBreakdown: [
    { name: 'Books & Materials', value: 22 },
    { name: 'Utilities', value: 18 },
    { name: 'IT Equipment', value: 15 },
    { name: 'Transport', value: 13 },
    { name: 'Security', value: 10 },
    { name: 'Cleaning', value: 8 },
    { name: 'Furniture', value: 8 },
    { name: 'Stationery', value: 6 },
  ],
}));
