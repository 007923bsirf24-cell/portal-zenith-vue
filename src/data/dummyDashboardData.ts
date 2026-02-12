// Dummy data for static prototype dashboards — automatically replaced when real embed URL is added

export const EXECUTIVE_DATA = {
  revenue: [
    { month: 'Jul', actual: 12.5, budget: 11.8 },
    { month: 'Aug', actual: 13.1, budget: 12.2 },
    { month: 'Sep', actual: 14.2, budget: 12.8 },
    { month: 'Oct', actual: 13.8, budget: 13.0 },
    { month: 'Nov', actual: 15.1, budget: 13.5 },
    { month: 'Dec', actual: 16.4, budget: 14.0 },
  ],
  kpis: [
    { label: 'Total Revenue', value: 'PKR 85.1M', change: '+12.3%', positive: true },
    { label: 'Operating Margin', value: '28.4%', change: '+2.1%', positive: true },
    { label: 'Student Enrollment', value: '14,250', change: '+8.5%', positive: true },
    { label: 'Fee Collection Rate', value: '94.2%', change: '-1.3%', positive: false },
  ],
};

export const BUDGET_DATA = {
  variance: [
    { dept: 'Administration', budget: 8.5, actual: 7.9 },
    { dept: 'Academic', budget: 22.0, actual: 23.5 },
    { dept: 'Facilities', budget: 6.2, actual: 5.8 },
    { dept: 'IT & Tech', budget: 4.5, actual: 4.9 },
    { dept: 'Sports', budget: 3.0, actual: 2.7 },
    { dept: 'Transport', budget: 5.8, actual: 6.1 },
  ],
  summary: [
    { label: 'Total Budget', value: 'PKR 50.0M' },
    { label: 'Actual Spend', value: 'PKR 50.9M' },
    { label: 'Variance', value: '-PKR 0.9M' },
    { label: 'Utilization', value: '101.8%' },
  ],
};

export const FEES_DATA = {
  collection: [
    { month: 'Jul', collected: 92, outstanding: 8 },
    { month: 'Aug', collected: 95, outstanding: 5 },
    { month: 'Sep', collected: 88, outstanding: 12 },
    { month: 'Oct', collected: 91, outstanding: 9 },
    { month: 'Nov', collected: 94, outstanding: 6 },
    { month: 'Dec', collected: 96, outstanding: 4 },
  ],
  aging: [
    { name: '0-30 days', value: 45 },
    { name: '31-60 days', value: 25 },
    { name: '61-90 days', value: 18 },
    { name: '90+ days', value: 12 },
  ],
};

export const CASH_DATA = {
  forecast: [
    { week: 'W1', inflow: 5.2, outflow: 4.1, balance: 8.3 },
    { week: 'W2', inflow: 3.8, outflow: 4.5, balance: 7.6 },
    { week: 'W3', inflow: 6.1, outflow: 3.9, balance: 9.8 },
    { week: 'W4', inflow: 4.5, outflow: 5.2, balance: 9.1 },
    { week: 'W5', inflow: 5.8, outflow: 4.0, balance: 10.9 },
    { week: 'W6', inflow: 3.2, outflow: 4.8, balance: 9.3 },
    { week: 'W7', inflow: 6.5, outflow: 3.5, balance: 12.3 },
    { week: 'W8', inflow: 4.0, outflow: 5.0, balance: 11.3 },
    { week: 'W9', inflow: 5.5, outflow: 4.2, balance: 12.6 },
    { week: 'W10', inflow: 4.8, outflow: 4.6, balance: 12.8 },
    { week: 'W11', inflow: 6.0, outflow: 3.8, balance: 15.0 },
    { week: 'W12', inflow: 5.0, outflow: 5.5, balance: 14.5 },
    { week: 'W13', inflow: 7.2, outflow: 4.0, balance: 17.7 },
  ],
  kpis: [
    { label: 'Current Balance', value: 'PKR 17.7M' },
    { label: 'Avg Weekly Inflow', value: 'PKR 5.2M' },
    { label: 'Avg Weekly Outflow', value: 'PKR 4.4M' },
    { label: 'Min Projected', value: 'PKR 7.6M' },
  ],
};

export const PAYROLL_DATA = {
  byDept: [
    { dept: 'Teaching Staff', cost: 18.5, headcount: 320 },
    { dept: 'Admin Staff', cost: 4.2, headcount: 85 },
    { dept: 'Support Staff', cost: 2.8, headcount: 110 },
    { dept: 'Management', cost: 3.5, headcount: 25 },
    { dept: 'IT & Lab', cost: 1.8, headcount: 30 },
  ],
  trend: [
    { month: 'Jul', cost: 28.5 },
    { month: 'Aug', cost: 29.1 },
    { month: 'Sep', cost: 30.2 },
    { month: 'Oct', cost: 30.8 },
    { month: 'Nov', cost: 30.5 },
    { month: 'Dec', cost: 31.2 },
  ],
};

export const PROCUREMENT_DATA = {
  byCategory: [
    { name: 'Textbooks & Materials', value: 35 },
    { name: 'Lab Equipment', value: 20 },
    { name: 'IT Hardware', value: 18 },
    { name: 'Furniture', value: 15 },
    { name: 'Stationery', value: 12 },
  ],
  vendors: [
    { vendor: 'Oxford Press', spend: 4.2, orders: 28, rating: 4.5 },
    { vendor: 'Tech Solutions', spend: 3.8, orders: 15, rating: 4.2 },
    { vendor: 'Lab World', spend: 2.5, orders: 12, rating: 4.0 },
    { vendor: 'Office Pro', spend: 1.9, orders: 35, rating: 3.8 },
  ],
};

export const AP_DATA = {
  aging: [
    { bucket: 'Current', amount: 3.2 },
    { bucket: '1-30 days', amount: 2.1 },
    { bucket: '31-60 days', amount: 1.5 },
    { bucket: '61-90 days', amount: 0.8 },
    { bucket: '90+ days', amount: 0.4 },
  ],
  upcoming: [
    { vendor: 'Oxford Press', amount: 'PKR 1.2M', due: '15 Jan', status: 'Due Soon' },
    { vendor: 'Tech Solutions', amount: 'PKR 0.8M', due: '20 Jan', status: 'Upcoming' },
    { vendor: 'Utility Co.', amount: 'PKR 0.5M', due: '25 Jan', status: 'Upcoming' },
    { vendor: 'Lab World', amount: 'PKR 0.3M', due: '28 Jan', status: 'Upcoming' },
    { vendor: 'Transport Ltd.', amount: 'PKR 0.6M', due: '31 Jan', status: 'Upcoming' },
  ],
};

export const CAPEX_DATA = {
  projects: [
    { name: 'New Campus Wing', budget: 25.0, spent: 18.5, progress: 74 },
    { name: 'IT Infrastructure', budget: 8.0, spent: 6.2, progress: 78 },
    { name: 'Lab Renovation', budget: 5.0, spent: 3.8, progress: 76 },
    { name: 'Sports Complex', budget: 12.0, spent: 4.5, progress: 38 },
  ],
  depreciation: [
    { category: 'Buildings', value: 2.8 },
    { category: 'Equipment', value: 1.5 },
    { category: 'Vehicles', value: 0.9 },
    { category: 'IT Assets', value: 1.2 },
    { category: 'Furniture', value: 0.6 },
  ],
};

export const COMPLIANCE_DATA = {
  status: [
    { area: 'Tax Filings', status: 'Compliant', dueDate: '31 Mar', risk: 'Low' },
    { area: 'Annual Audit', status: 'In Progress', dueDate: '28 Feb', risk: 'Medium' },
    { area: 'Staff Certifications', status: 'Action Needed', dueDate: '15 Jan', risk: 'High' },
    { area: 'Safety Inspections', status: 'Compliant', dueDate: '30 Jun', risk: 'Low' },
    { area: 'Data Privacy', status: 'In Progress', dueDate: '31 Mar', risk: 'Medium' },
    { area: 'Insurance Renewal', status: 'Compliant', dueDate: '30 Sep', risk: 'Low' },
  ],
  riskDistribution: [
    { name: 'Low', value: 60 },
    { name: 'Medium', value: 28 },
    { name: 'High', value: 12 },
  ],
};

export const CLOSE_PACK_DATA = {
  checklist: [
    { task: 'Bank Reconciliation', status: 'Complete', owner: 'Treasury' },
    { task: 'Revenue Recognition', status: 'Complete', owner: 'Finance' },
    { task: 'Expense Accruals', status: 'In Progress', owner: 'AP Team' },
    { task: 'Intercompany Eliminations', status: 'Pending', owner: 'Finance' },
    { task: 'Depreciation Run', status: 'Complete', owner: 'Fixed Assets' },
    { task: 'Payroll Posting', status: 'Complete', owner: 'HR/Payroll' },
    { task: 'Tax Provisions', status: 'In Progress', owner: 'Tax Team' },
    { task: 'Management Report', status: 'Pending', owner: 'FP&A' },
  ],
  progress: [
    { name: 'Complete', value: 50 },
    { name: 'In Progress', value: 25 },
    { name: 'Pending', value: 25 },
  ],
};
