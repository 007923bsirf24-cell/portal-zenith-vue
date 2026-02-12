// Shared dummy data constants
export const CAMPUSES = ['All Campuses', 'Islamabad', 'Lahore', 'Karachi', 'Peshawar', 'Multan'] as const;
export const ACADEMIC_YEARS = ['2025-26', '2024-25', '2023-24'] as const;
export const MONTHS = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] as const;
export const QUARTERS = ['Q1 (Jul-Sep)', 'Q2 (Oct-Dec)', 'Q3 (Jan-Mar)', 'Q4 (Apr-Jun)'] as const;

// Helper to generate campus-aware data
function perCampus<T>(generator: (campus: string) => T): Record<string, T> {
  const result: Record<string, T> = {};
  CAMPUSES.filter(c => c !== 'All Campuses').forEach(c => { result[c] = generator(c); });
  return result;
}

// Multipliers per campus for variance
const CAMPUS_MULTIPLIERS: Record<string, number> = {
  Islamabad: 1.0, Lahore: 1.15, Karachi: 1.25, Peshawar: 0.7, Multan: 0.6,
};

function m(campus: string, base: number) {
  return +(base * (CAMPUS_MULTIPLIERS[campus] || 1)).toFixed(1);
}

// ─── Executive ───
export const EXECUTIVE_DATA = perCampus(campus => ({
  kpis: [
    { label: 'Total Revenue', value: `PKR ${m(campus, 85.1)}M`, change: '+12.3%', positive: true },
    { label: 'Operating Margin', value: '28.4%', change: '+2.1%', positive: true },
    { label: 'Student Enrollment', value: `${Math.round(14250 * (CAMPUS_MULTIPLIERS[campus] || 1)).toLocaleString()}`, change: '+8.5%', positive: true },
    { label: 'Fee Collection Rate', value: '94.2%', change: '-1.3%', positive: false },
    { label: 'Staff Count', value: `${Math.round(570 * (CAMPUS_MULTIPLIERS[campus] || 1))}`, change: '+3.2%', positive: true },
    { label: 'Avg Cost/Student', value: `PKR ${m(campus, 5.97)}K`, change: '-2.4%', positive: true },
  ],
  revenueTrend: MONTHS.map((month, i) => ({
    month,
    revenue: m(campus, 10 + i * 0.6 + Math.sin(i) * 2),
    budget: m(campus, 10 + i * 0.5),
    lastYear: m(campus, 8.5 + i * 0.5 + Math.cos(i) * 1.5),
  })),
  revenueByStream: [
    { name: 'Tuition Fees', value: 62 },
    { name: 'Transport Fees', value: 12 },
    { name: 'Exam Fees', value: 8 },
    { name: 'Hostel Fees', value: 10 },
    { name: 'Other Income', value: 8 },
  ],
  expenseBreakdown: [
    { category: 'Salaries', amount: m(campus, 32) },
    { category: 'Facilities', amount: m(campus, 8.5) },
    { category: 'Academic', amount: m(campus, 6.2) },
    { category: 'Transport', amount: m(campus, 5.1) },
    { category: 'IT & Tech', amount: m(campus, 3.8) },
    { category: 'Admin', amount: m(campus, 4.2) },
  ],
  enrollmentTrend: MONTHS.map((month, i) => ({
    month,
    students: Math.round((13500 + i * 120 + Math.sin(i) * 200) * (CAMPUS_MULTIPLIERS[campus] || 1)),
  })),
}));

// ─── Budget ───
export const BUDGET_DATA = perCampus(campus => ({
  summary: [
    { label: 'Total Budget', value: `PKR ${m(campus, 50.0)}M` },
    { label: 'YTD Actual', value: `PKR ${m(campus, 50.9)}M` },
    { label: 'Variance', value: `PKR ${m(campus, -0.9)}M`, positive: false, change: '-1.8%' },
    { label: 'Utilization', value: '101.8%' },
  ],
  byDepartment: [
    { dept: 'Administration', budget: m(campus, 8.5), actual: m(campus, 7.9) },
    { dept: 'Academic', budget: m(campus, 22.0), actual: m(campus, 23.5) },
    { dept: 'Facilities', budget: m(campus, 6.2), actual: m(campus, 5.8) },
    { dept: 'IT & Tech', budget: m(campus, 4.5), actual: m(campus, 4.9) },
    { dept: 'Sports', budget: m(campus, 3.0), actual: m(campus, 2.7) },
    { dept: 'Transport', budget: m(campus, 5.8), actual: m(campus, 6.1) },
  ],
  monthlyTrend: MONTHS.map((month, i) => ({
    month,
    budget: m(campus, 4.2),
    actual: m(campus, 3.8 + Math.sin(i) * 0.8),
  })),
  varianceWaterfall: [
    { name: 'Budget', value: m(campus, 50.0) },
    { name: 'Salaries (+)', value: m(campus, 1.2) },
    { name: 'Facilities (-)', value: m(campus, -0.4) },
    { name: 'Academic (+)', value: m(campus, 1.5) },
    { name: 'Savings (-)', value: m(campus, -1.4) },
    { name: 'Actual', value: m(campus, 50.9) },
  ],
}));

// ─── Fees ───
export const FEES_DATA = perCampus(campus => ({
  kpis: [
    { label: 'Total Billed', value: `PKR ${m(campus, 42.5)}M` },
    { label: 'Collected', value: `PKR ${m(campus, 40.0)}M` },
    { label: 'Outstanding', value: `PKR ${m(campus, 2.5)}M`, positive: false, change: '+5.2%' },
    { label: 'Collection Rate', value: '94.1%', positive: true, change: '+1.2%' },
  ],
  collectionTrend: MONTHS.map((month, i) => ({
    month,
    billed: m(campus, 3.5 + Math.sin(i) * 0.5),
    collected: m(campus, 3.2 + Math.sin(i) * 0.4),
    rate: 88 + Math.round(Math.sin(i + 1) * 6),
  })),
  aging: [
    { bucket: '0-30 days', amount: m(campus, 1.1), count: Math.round(120 * (CAMPUS_MULTIPLIERS[campus] || 1)) },
    { bucket: '31-60 days', amount: m(campus, 0.6), count: Math.round(65 * (CAMPUS_MULTIPLIERS[campus] || 1)) },
    { bucket: '61-90 days', amount: m(campus, 0.5), count: Math.round(42 * (CAMPUS_MULTIPLIERS[campus] || 1)) },
    { bucket: '90+ days', amount: m(campus, 0.3), count: Math.round(28 * (CAMPUS_MULTIPLIERS[campus] || 1)) },
  ],
  byClass: [
    { name: 'Pre-Primary', value: 15 },
    { name: 'Primary (1-5)', value: 30 },
    { name: 'Middle (6-8)', value: 25 },
    { name: 'Secondary (9-10)', value: 18 },
    { name: 'Higher Sec (11-12)', value: 12 },
  ],
}));

// ─── Cash ───
export const CASH_DATA = perCampus(campus => ({
  kpis: [
    { label: 'Current Balance', value: `PKR ${m(campus, 17.7)}M` },
    { label: 'Avg Weekly Inflow', value: `PKR ${m(campus, 5.2)}M` },
    { label: 'Avg Weekly Outflow', value: `PKR ${m(campus, 4.4)}M` },
    { label: 'Min Projected', value: `PKR ${m(campus, 7.6)}M` },
  ],
  forecast: Array.from({ length: 13 }, (_, i) => ({
    week: `W${i + 1}`,
    inflow: m(campus, 3.5 + Math.sin(i * 0.8) * 2),
    outflow: m(campus, 3.2 + Math.cos(i * 0.6) * 1.5),
    balance: m(campus, 8 + i * 0.7 + Math.sin(i) * 2),
  })),
  dailyMovements: Array.from({ length: 30 }, (_, i) => ({
    day: `${i + 1}`,
    inflow: m(campus, 0.5 + Math.random() * 0.8),
    outflow: m(campus, 0.4 + Math.random() * 0.7),
  })),
  bankAccounts: [
    { bank: 'HBL Main Account', balance: `PKR ${m(campus, 8.2)}M`, type: 'Operating' },
    { bank: 'UBL Fee Collection', balance: `PKR ${m(campus, 5.1)}M`, type: 'Collection' },
    { bank: 'MCB Savings', balance: `PKR ${m(campus, 3.5)}M`, type: 'Reserve' },
    { bank: 'ABL Payroll', balance: `PKR ${m(campus, 0.9)}M`, type: 'Payroll' },
  ],
}));

// ─── Payroll ───
export const PAYROLL_DATA = perCampus(campus => ({
  kpis: [
    { label: 'Monthly Payroll', value: `PKR ${m(campus, 31.2)}M` },
    { label: 'Total Headcount', value: `${Math.round(570 * (CAMPUS_MULTIPLIERS[campus] || 1))}` },
    { label: 'Avg Salary', value: `PKR ${m(campus, 54.7)}K` },
    { label: 'YoY Growth', value: '+6.8%', positive: true, change: '+6.8%' },
  ],
  byDept: [
    { dept: 'Teaching Staff', cost: m(campus, 18.5), headcount: Math.round(320 * (CAMPUS_MULTIPLIERS[campus] || 1)) },
    { dept: 'Admin Staff', cost: m(campus, 4.2), headcount: Math.round(85 * (CAMPUS_MULTIPLIERS[campus] || 1)) },
    { dept: 'Support Staff', cost: m(campus, 2.8), headcount: Math.round(110 * (CAMPUS_MULTIPLIERS[campus] || 1)) },
    { dept: 'Management', cost: m(campus, 3.5), headcount: Math.round(25 * (CAMPUS_MULTIPLIERS[campus] || 1)) },
    { dept: 'IT & Lab', cost: m(campus, 1.8), headcount: Math.round(30 * (CAMPUS_MULTIPLIERS[campus] || 1)) },
  ],
  trend: MONTHS.map((month, i) => ({
    month,
    cost: m(campus, 28 + i * 0.3 + Math.sin(i) * 0.5),
    headcount: Math.round((540 + i * 5) * (CAMPUS_MULTIPLIERS[campus] || 1)),
  })),
  byGrade: [
    { name: 'Grade 1-5', value: 35 },
    { name: 'Grade 6-10', value: 25 },
    { name: 'Grade 11-15', value: 20 },
    { name: 'Grade 16+', value: 20 },
  ],
}));

// ─── Procurement ───
export const PROCUREMENT_DATA = perCampus(campus => ({
  kpis: [
    { label: 'Total Spend', value: `PKR ${m(campus, 12.4)}M` },
    { label: 'Active POs', value: `${Math.round(85 * (CAMPUS_MULTIPLIERS[campus] || 1))}` },
    { label: 'Avg Delivery Time', value: '12 days' },
    { label: 'Cost Savings', value: `PKR ${m(campus, 1.2)}M`, positive: true, change: '+8.5%' },
  ],
  byCategory: [
    { name: 'Textbooks & Materials', value: m(campus, 4.3) },
    { name: 'Lab Equipment', value: m(campus, 2.5) },
    { name: 'IT Hardware', value: m(campus, 2.2) },
    { name: 'Furniture', value: m(campus, 1.9) },
    { name: 'Stationery', value: m(campus, 1.5) },
  ],
  monthlySpend: MONTHS.map((month, i) => ({
    month,
    spend: m(campus, 0.8 + Math.sin(i) * 0.4),
    orders: Math.round((6 + Math.sin(i) * 3) * (CAMPUS_MULTIPLIERS[campus] || 1)),
  })),
  vendors: [
    { vendor: 'Oxford University Press', spend: `PKR ${m(campus, 4.2)}M`, orders: 28, rating: 4.5, onTime: 96 },
    { vendor: 'Tech Solutions Ltd', spend: `PKR ${m(campus, 3.8)}M`, orders: 15, rating: 4.2, onTime: 88 },
    { vendor: 'Lab World Intl', spend: `PKR ${m(campus, 2.5)}M`, orders: 12, rating: 4.0, onTime: 92 },
    { vendor: 'Office Pro Pakistan', spend: `PKR ${m(campus, 1.9)}M`, orders: 35, rating: 3.8, onTime: 85 },
  ],
}));

// ─── AP ───
export const AP_DATA = perCampus(campus => ({
  kpis: [
    { label: 'Total Payable', value: `PKR ${m(campus, 8.0)}M` },
    { label: 'Overdue', value: `PKR ${m(campus, 1.2)}M`, positive: false, change: '+15%' },
    { label: 'Avg Payment Time', value: '22 days' },
    { label: 'Discount Captured', value: `PKR ${m(campus, 0.3)}M`, positive: true, change: '+12%' },
  ],
  aging: [
    { bucket: 'Current', amount: m(campus, 3.2), count: 45 },
    { bucket: '1-30 days', amount: m(campus, 2.1), count: 28 },
    { bucket: '31-60 days', amount: m(campus, 1.5), count: 15 },
    { bucket: '61-90 days', amount: m(campus, 0.8), count: 8 },
    { bucket: '90+ days', amount: m(campus, 0.4), count: 4 },
  ],
  paymentTrend: MONTHS.map((month, i) => ({
    month,
    paid: m(campus, 2.5 + Math.sin(i) * 0.8),
    due: m(campus, 3.0 + Math.cos(i) * 0.6),
  })),
  upcoming: [
    { vendor: 'Oxford University Press', amount: `PKR ${m(campus, 1.2)}M`, due: '15 Jan 2026', priority: 'High' },
    { vendor: 'Tech Solutions Ltd', amount: `PKR ${m(campus, 0.8)}M`, due: '20 Jan 2026', priority: 'Medium' },
    { vendor: 'Pakistan Electric Co', amount: `PKR ${m(campus, 0.5)}M`, due: '25 Jan 2026', priority: 'High' },
    { vendor: 'Lab World Intl', amount: `PKR ${m(campus, 0.3)}M`, due: '28 Jan 2026', priority: 'Low' },
    { vendor: 'City Transport Services', amount: `PKR ${m(campus, 0.6)}M`, due: '31 Jan 2026', priority: 'Medium' },
  ],
}));

// ─── Capex ───
export const CAPEX_DATA = perCampus(campus => ({
  kpis: [
    { label: 'Total Capex Budget', value: `PKR ${m(campus, 50.0)}M` },
    { label: 'YTD Spent', value: `PKR ${m(campus, 33.0)}M` },
    { label: 'Committed', value: `PKR ${m(campus, 8.5)}M` },
    { label: 'Available', value: `PKR ${m(campus, 8.5)}M`, positive: true, change: '17%' },
  ],
  projects: [
    { name: 'New Academic Wing', budget: m(campus, 25.0), spent: m(campus, 18.5), progress: 74 },
    { name: 'IT Infrastructure Upgrade', budget: m(campus, 8.0), spent: m(campus, 6.2), progress: 78 },
    { name: 'Science Lab Renovation', budget: m(campus, 5.0), spent: m(campus, 3.8), progress: 76 },
    { name: 'Sports Complex', budget: m(campus, 12.0), spent: m(campus, 4.5), progress: 38 },
  ],
  spendTrend: MONTHS.map((month, i) => ({
    month,
    planned: m(campus, 3.5 + Math.sin(i) * 0.5),
    actual: m(campus, 3.0 + Math.cos(i) * 1),
  })),
  depreciation: [
    { category: 'Buildings', value: m(campus, 2.8) },
    { category: 'Equipment', value: m(campus, 1.5) },
    { category: 'Vehicles', value: m(campus, 0.9) },
    { category: 'IT Assets', value: m(campus, 1.2) },
    { category: 'Furniture', value: m(campus, 0.6) },
  ],
}));

// ─── Compliance ───
export const COMPLIANCE_DATA = {
  kpis: [
    { label: 'Overall Score', value: '87%', positive: true, change: '+3%' },
    { label: 'Open Items', value: '12' },
    { label: 'Overdue', value: '3', positive: false, change: '+2' },
    { label: 'Audit Rating', value: 'Good' },
  ],
  items: [
    { area: 'Tax Filings (FBR)', status: 'Compliant', dueDate: '31 Mar 2026', risk: 'Low', owner: 'Finance' },
    { area: 'Annual External Audit', status: 'In Progress', dueDate: '28 Feb 2026', risk: 'Medium', owner: 'CFO Office' },
    { area: 'Staff Teaching Certifications', status: 'Action Needed', dueDate: '15 Jan 2026', risk: 'High', owner: 'HR' },
    { area: 'Fire Safety Inspection', status: 'Compliant', dueDate: '30 Jun 2026', risk: 'Low', owner: 'Facilities' },
    { area: 'Student Data Privacy (PDPA)', status: 'In Progress', dueDate: '31 Mar 2026', risk: 'Medium', owner: 'IT' },
    { area: 'Insurance Policies Renewal', status: 'Compliant', dueDate: '30 Sep 2026', risk: 'Low', owner: 'Admin' },
    { area: 'EOBI Contributions', status: 'Compliant', dueDate: '15 Feb 2026', risk: 'Low', owner: 'HR' },
    { area: 'Building Code Compliance', status: 'Action Needed', dueDate: '28 Feb 2026', risk: 'High', owner: 'Facilities' },
  ],
  riskDistribution: [
    { name: 'Low Risk', value: 55 },
    { name: 'Medium Risk', value: 30 },
    { name: 'High Risk', value: 15 },
  ],
  trend: MONTHS.slice(0, 6).map((month, i) => ({
    month,
    score: 78 + i * 2 + Math.round(Math.sin(i) * 3),
    items: 18 - i,
  })),
};

// ─── Close Pack ───
export const CLOSE_PACK_DATA = {
  summary: [
    { label: 'Tasks Total', value: '24' },
    { label: 'Completed', value: '14', positive: true, change: '58%' },
    { label: 'In Progress', value: '6' },
    { label: 'Pending', value: '4', positive: false, change: '17%' },
  ],
  checklist: [
    { task: 'Bank Reconciliation', status: 'Complete', owner: 'Treasury', time: '2h 15m' },
    { task: 'Revenue Recognition', status: 'Complete', owner: 'Finance', time: '3h 40m' },
    { task: 'Fee Receivables Review', status: 'Complete', owner: 'AR Team', time: '1h 50m' },
    { task: 'Expense Accruals', status: 'In Progress', owner: 'AP Team', time: '—' },
    { task: 'Intercompany Eliminations', status: 'Pending', owner: 'Finance', time: '—' },
    { task: 'Fixed Asset Depreciation', status: 'Complete', owner: 'Fixed Assets', time: '45m' },
    { task: 'Payroll Posting & Verification', status: 'Complete', owner: 'HR/Payroll', time: '2h 10m' },
    { task: 'Tax Provisions', status: 'In Progress', owner: 'Tax Team', time: '—' },
    { task: 'Management Reporting Pack', status: 'Pending', owner: 'FP&A', time: '—' },
    { task: 'Board Presentation', status: 'Pending', owner: 'CFO Office', time: '—' },
  ],
  progress: [
    { name: 'Complete', value: 58 },
    { name: 'In Progress', value: 25 },
    { name: 'Pending', value: 17 },
  ],
  timeline: MONTHS.slice(0, 6).map((month, i) => ({
    month,
    daysToClose: 8 - Math.round(i * 0.4),
    target: 5,
  })),
};
