// =============================================================================
//  SITE CONFIG — ONE FILE TO RULE THEM ALL
//  Edit anything here and redeploy to see changes live for ALL users.
// =============================================================================

// -----------------------------------------------------------------------------
// 1. ORGANISATION
// -----------------------------------------------------------------------------
export const ORG_NAME = 'Pak Turk Maarif Schools';

// -----------------------------------------------------------------------------
// 2. COLORS  (use hex values — easiest to copy from any color picker)
// -----------------------------------------------------------------------------
export const COLORS = {
  /** Main brand color — buttons, links, highlights */
  primary: '#04aebe',       // teal

  /** Secondary accent */
  accent: '#0d131c',        // dark navy

  /** Page background */
  background: '#f0f8fa',    // very light teal-white

  /** Card / surface background */
  surface: '#ffffff',       // white
};

// -----------------------------------------------------------------------------
// 3. COVER PAGE — Hero text, trust pills, quick-link buttons
// -----------------------------------------------------------------------------
export const COVER = {
  /** First part of the big headline (plain text) */
  headline: 'Pak Turk Maarif Schools',

  /** Second part of the headline (shown in brand color) */
  headlineHighlight: 'Reporting Hub',

  /** Paragraph under the headline */
  subtitle:
    'Centralized access to all Pak Turk Maarif dashboards - student enrollment, academic performance, financials, and campus operations. Integrated with SAPB1, HRMS Portal and Cloud Campus',

  /** Small pill badges shown under the subtitle */
  trustPills: [
    { icon: 'Shield',  label: 'Secure access' },
    { icon: 'Users',   label: 'Role-based permissions' },
    { icon: 'Lock',    label: 'Confidential' },
  ],

  /** Title above the KPI grid on the right side of the hero */
  portalPreviewTitle: 'Key Performance Indicators',

  /** Quick-link buttons  (first one is the big primary button) */
  quickLinks: [
    { id: 'ql-1', label: 'Browse Dashboards',  route: '/dashboards' },
    { id: 'ql-2', label: 'Student Enrollment', route: '/dashboard/executive-overview' },
    { id: 'ql-3', label: 'Financial Reports',  route: '/dashboard/budget-vs-actual' },
  ],
};

// -----------------------------------------------------------------------------
// 4. KPI TILES — shown on the right side of the cover hero
//    Available icons: https://lucide.dev/icons  (copy the exact name)
// -----------------------------------------------------------------------------
export const KPIS = [
  { id: 'kpi-1', label: 'Total Students',    value: '28,450', icon: 'GraduationCap' },
  { id: 'kpi-2', label: 'Fee Collection',    value: '94.2%',  icon: 'Banknote'      },
  { id: 'kpi-3', label: 'Pass Rate',         value: '97.8%',  icon: 'Award'         },
  { id: 'kpi-4', label: 'Campuses',          value: '28',     icon: 'Building2'     },
  { id: 'kpi-5', label: 'New Admissions',    value: '3,120',  icon: 'UserPlus'      },
  { id: 'kpi-6', label: 'Avg Score',         value: '82.5%',  icon: 'TrendingUp'    },
  { id: 'kpi-7', label: 'Budget Utilized',   value: '87%',    icon: 'PieChart'      },
  { id: 'kpi-8', label: 'Graduation Rate',   value: '96.1%',  icon: 'Trophy'        },
];

// -----------------------------------------------------------------------------
// 5. INFO CARDS — four campus / contact cards on the home page
//    Add or remove objects to add or remove cards.
// -----------------------------------------------------------------------------
export const INFO_CARDS = [
  {
    id: 'card-1',
    title: 'Punjab Campuses',
    icon: 'Building2',
    items: [
      'Lahore Campus — 0300-1234567',
      'Islamabad Campus — 0300-2345678',
      'Rawalpindi Campus — 0300-3456789',
      'Faisalabad Campus — 0300-4567890',
    ],
  },
  {
    id: 'card-2',
    title: 'Sindh & Balochistan',
    icon: 'Building2',
    items: [
      'Karachi Campus — 0300-5678901',
      'Hyderabad Campus — 0300-6789012',
      'Quetta Campus — 0300-7890123',
    ],
  },
  {
    id: 'card-3',
    title: 'KPK & Northern Areas',
    icon: 'Building2',
    items: [
      'Peshawar Campus — 0300-8901234',
      'Abbottabad Campus — 0300-9012345',
      'Gilgit Campus — 0300-0123456',
    ],
  },
  {
    id: 'card-4',
    title: 'Admin & Support',
    icon: 'Headphones',
    items: [
      'Head Office: Islamabad',
      'info@pakturkschools.edu.pk',
      'Helpdesk: 051-1234567',
      'Office hours: 8AM–4PM PKT',
    ],
  },
];

// -----------------------------------------------------------------------------
// 6. DASHBOARDS — Add, remove, or edit dashboards here.
//    status:   'Live Data' | 'Preview'
//    featured: true  → shows on home page "Featured Dashboards"
//    embedUrl: paste your Power BI / Looker / Tableau URL here
//    category: must be one of the CATEGORIES list below
//    icon names: https://lucide.dev/icons
// -----------------------------------------------------------------------------
export const DASHBOARDS = [
  {
    id: 'executive-overview',
    title: 'Executive Overview',
    description: 'High-level financial KPIs, trends, and executive summary for leadership review.',
    category: 'Executive',
    tags: ['KPI', 'summary', 'leadership'],
    status: 'Live Data' as const,
    featured: true,
    iconName: 'Crown',
    embedUrl: '',   // ← paste Power BI URL here
  },
  {
    id: 'budget-vs-actual',
    title: 'Budget vs Actual & Variance',
    description: 'Track budget performance against actuals with variance analysis across departments.',
    category: 'Budget',
    tags: ['budget', 'variance', 'actuals', 'departments'],
    status: 'Live Data' as const,
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
    status: 'Preview' as const,
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
    status: 'Live Data' as const,
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
    status: 'Preview' as const,
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
    status: 'Preview' as const,
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
    status: 'Preview' as const,
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
    status: 'Preview' as const,
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
    status: 'Preview' as const,
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
    status: 'Live Data' as const,
    featured: true,
    iconName: 'PackageCheck',
    embedUrl: '',
  },
  {
    id: 'intercompany-reconciliation',
    title: 'Inter-Company Reconciliation',
    description: 'Cross-campus and inter-entity reconciliation with mismatch highlights and aging drill-down.',
    category: 'Reconciliation',
    tags: ['intercompany', 'reconciliation', 'elimination', 'campus'],
    status: 'Preview' as const,
    featured: true,
    iconName: 'ArrowLeftRight',
    embedUrl: '',
  },
  {
    id: 'profit-and-loss',
    title: 'Profit & Loss Statement',
    description: 'Income statement by campus with revenue, COGS, operating expenses, and net margin analysis.',
    category: 'P&L',
    tags: ['P&L', 'income', 'expenses', 'margin', 'campus'],
    status: 'Live Data' as const,
    featured: true,
    iconName: 'TrendingUp',
    embedUrl: '',
  },
  {
    id: 'discount-report',
    title: 'Student Discount Report',
    description: 'Discounts and fee concessions granted to students by campus, category, and approval status.',
    category: 'Fees/Receivables',
    tags: ['discount', 'concession', 'scholarship', 'waiver'],
    status: 'Preview' as const,
    featured: false,
    iconName: 'BadgePercent',
    embedUrl: '',
  },
  {
    id: 'balance-sheet',
    title: 'Balance Sheet',
    description: 'Assets, liabilities, and equity overview with campus-level drill-down and period comparison.',
    category: 'Executive',
    tags: ['balance sheet', 'assets', 'liabilities', 'equity'],
    status: 'Preview' as const,
    featured: false,
    iconName: 'Scale',
    embedUrl: '',
  },
  {
    id: 'cash-flow-statement',
    title: 'Cash Flow Statement',
    description: 'Operating, investing, and financing cash flows with campus-wise breakdown.',
    category: 'Cash',
    tags: ['cash flow', 'operating', 'investing', 'financing'],
    status: 'Preview' as const,
    featured: false,
    iconName: 'Wallet',
    embedUrl: '',
  },
  {
    id: 'student-enrollment',
    title: 'Student Enrollment Analytics',
    description: 'Enrollment trends, admissions pipeline, retention rates, and demographic analysis by campus.',
    category: 'Students',
    tags: ['enrollment', 'admissions', 'retention', 'demographics'],
    status: 'Live Data' as const,
    featured: true,
    iconName: 'GraduationCap',
    embedUrl: '',
  },
  {
    id: 'tax-report',
    title: 'Tax & WHT Report',
    description: 'Withholding tax, sales tax, and income tax summaries with filing status tracking.',
    category: 'Compliance',
    tags: ['tax', 'WHT', 'sales tax', 'filing'],
    status: 'Preview' as const,
    featured: false,
    iconName: 'Landmark',
    embedUrl: '',
  },
  {
    id: 'trial-balance',
    title: 'Trial Balance',
    description: 'Period-end trial balance with debit/credit totals, variance flags, and ledger drill-through.',
    category: 'Close Pack',
    tags: ['trial balance', 'ledger', 'GL', 'period-end'],
    status: 'Preview' as const,
    featured: false,
    iconName: 'BookOpen',
    embedUrl: '',
  },
];

// -----------------------------------------------------------------------------
// 7. NAVBAR — App title and logo
//    To use a logo image: put the file in src/assets/ and import it at the
//    top of src/components/Layout.tsx  (one-time code change).
//    Leave logoUrl empty to show the app name as text only.
// -----------------------------------------------------------------------------
export const NAVBAR = {
  appName: 'Executive Reporting',
  /** Full path to logo import, e.g. logoUrl will be set from Layout.tsx */
  showLogo: true,           // set false to hide the logo icon
};
