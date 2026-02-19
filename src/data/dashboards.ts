/**
 * DASHBOARD DEFAULTS — Edit DEFAULT_DASHBOARDS below to permanently set
 * your dashboard list. Add embedUrl values to show real Power BI / Looker embeds.
 */

export interface Dashboard {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  status: 'Live Data' | 'Preview';
  featured: boolean;
  iconName: string;
  embedUrl: string;
}

export const CATEGORIES = [
  'Executive',
  'Budget',
  'Fees/Receivables',
  'Cash',
  'Payroll',
  'Procurement',
  'AP',
  'Capex',
  'Compliance',
  'Close Pack',
] as const;

export const CATEGORY_ICON_FALLBACKS: Record<string, string> = {
  Executive: 'Crown',
  Budget: 'PiggyBank',
  'Fees/Receivables': 'Receipt',
  Cash: 'Banknote',
  Payroll: 'Users',
  Procurement: 'ShoppingCart',
  AP: 'FileText',
  Capex: 'Building',
  Compliance: 'ShieldCheck',
  'Close Pack': 'PackageCheck',
};

export const DEFAULT_DASHBOARDS: Dashboard[] = [
  {
    id: 'executive-overview',
    title: 'Executive Overview',
    description: 'High-level financial KPIs, trends, and executive summary for leadership review.',
    category: 'Executive',
    tags: ['KPI', 'summary', 'leadership'],
    status: 'Live Data',
    featured: true,
    iconName: 'Crown',
    embedUrl: '',
  },
  {
    id: 'budget-vs-actual',
    title: 'Budget vs Actual & Variance',
    description: 'Track budget performance against actuals with variance analysis across departments.',
    category: 'Budget',
    tags: ['budget', 'variance', 'actuals', 'departments'],
    status: 'Live Data',
    featured: true,
    iconName: 'PiggyBank',
    embedUrl: '',
  },
  {
    id: 'fee-collection-receivables',
    title: 'Fee Collection & Receivables',
    description: 'Monitor fee collection rates, outstanding receivables, and aging analysis.',
    category: 'Fees/Receivables',
    tags: ['fees', 'receivables', 'aging', 'collection'],
    status: 'Preview',
    featured: false,
    iconName: 'Receipt',
    embedUrl: '',
  },
  {
    id: 'cash-13-week-forecast',
    title: 'Cash & 13-Week Forecast',
    description: 'Real-time cash position, daily movements, and rolling 13-week forecast.',
    category: 'Cash',
    tags: ['cash', 'forecast', 'liquidity', 'treasury'],
    status: 'Live Data',
    featured: true,
    iconName: 'Banknote',
    embedUrl: '',
  },
  {
    id: 'payroll-headcount',
    title: 'Payroll & Headcount Cost',
    description: 'Payroll expenses by department, headcount trends, and cost-per-employee metrics.',
    category: 'Payroll',
    tags: ['payroll', 'headcount', 'compensation', 'HR'],
    status: 'Preview',
    featured: false,
    iconName: 'Users',
    embedUrl: '',
  },
  {
    id: 'procurement-vendor-spend',
    title: 'Procurement & Vendor Spend',
    description: 'Vendor performance, spend by category, contract compliance, and savings tracking.',
    category: 'Procurement',
    tags: ['procurement', 'vendor', 'spend', 'contracts'],
    status: 'Preview',
    featured: false,
    iconName: 'ShoppingCart',
    embedUrl: '',
  },
  {
    id: 'accounts-payable-aging',
    title: 'Accounts Payable Aging & Upcoming Payments',
    description: 'AP aging buckets, upcoming payment schedules, and early payment discount opportunities.',
    category: 'AP',
    tags: ['AP', 'aging', 'payments', 'invoices'],
    status: 'Preview',
    featured: false,
    iconName: 'FileText',
    embedUrl: '',
  },
  {
    id: 'capex-fixed-assets',
    title: 'Capex & Fixed Assets',
    description: 'Capital expenditure tracking, asset register, depreciation schedules, and ROI analysis.',
    category: 'Capex',
    tags: ['capex', 'assets', 'depreciation', 'investment'],
    status: 'Preview',
    featured: false,
    iconName: 'Building',
    embedUrl: '',
  },
  {
    id: 'compliance-tracker',
    title: 'Compliance Tracker',
    description: 'Regulatory compliance status, audit findings, policy adherence, and risk indicators.',
    category: 'Compliance',
    tags: ['compliance', 'audit', 'risk', 'regulatory'],
    status: 'Preview',
    featured: false,
    iconName: 'ShieldCheck',
    embedUrl: '',
  },
  {
    id: 'monthly-closing-pack',
    title: 'Monthly Closing Pack',
    description: 'Consolidated month-end reports, reconciliation status, and close checklist progress.',
    category: 'Close Pack',
    tags: ['close', 'month-end', 'reconciliation', 'reporting'],
    status: 'Live Data',
    featured: true,
    iconName: 'PackageCheck',
    embedUrl: '',
  },
];
