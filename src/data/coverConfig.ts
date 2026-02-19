/**
 * COVER PAGE DEFAULTS — Edit the DEFAULT_COVER_CONFIG below to permanently
 * set your cover page content. These values are used when localStorage is cleared.
 */

export interface CoverKPI {
  id: string;
  label: string;
  value: string;
  icon: string;
}

export interface CoverInfoCard {
  id: string;
  title: string;
  icon: string;
  items: string[];
}

export interface CoverQuickLink {
  id: string;
  label: string;
  route: string;
}

export interface CoverConfig {
  headline: string;
  headlineHighlight: string;
  subtitle: string;
  trustPills: { icon: string; label: string }[];
  kpis: CoverKPI[];
  infoCards: CoverInfoCard[];
  quickLinks: CoverQuickLink[];
  portalPreviewTitle: string;
}

export const DEFAULT_COVER_CONFIG: CoverConfig = {
  headline: 'Pak Turk Maarif Schools',
  headlineHighlight: 'Reporting Hub',
  subtitle: 'Centralized access to all Pak Turk Maarif dashboards — student enrollment, academic performance, financials, and campus operations — all in one place.',
  trustPills: [
    { icon: 'Shield', label: 'Secure access' },
    { icon: 'Users', label: 'Role-based permissions' },
    { icon: 'Lock', label: 'Confidential' },
  ],
  portalPreviewTitle: 'Key Performance Indicators',
  kpis: [
    { id: 'kpi-1', label: 'Total Students', value: '28,450', icon: 'GraduationCap' },
    { id: 'kpi-2', label: 'Fee Collection', value: '94.2%', icon: 'Banknote' },
    { id: 'kpi-3', label: 'Pass Rate', value: '97.8%', icon: 'Award' },
    { id: 'kpi-4', label: 'Campuses', value: '28', icon: 'Building2' },
    { id: 'kpi-5', label: 'New Admissions', value: '3,120', icon: 'UserPlus' },
    { id: 'kpi-6', label: 'Avg Score', value: '82.5%', icon: 'TrendingUp' },
    { id: 'kpi-7', label: 'Budget Utilized', value: '87%', icon: 'PieChart' },
    { id: 'kpi-8', label: 'Graduation Rate', value: '96.1%', icon: 'Trophy' },
  ],
  infoCards: [
    {
      id: 'card-1',
      title: 'Punjab Campuses',
      icon: 'Building2',
      items: ['Lahore Campus — 0300-1234567', 'Islamabad Campus — 0300-2345678', 'Rawalpindi Campus — 0300-3456789', 'Faisalabad Campus — 0300-4567890'],
    },
    {
      id: 'card-2',
      title: 'Sindh & Balochistan',
      icon: 'Building2',
      items: ['Karachi Campus — 0300-5678901', 'Hyderabad Campus — 0300-6789012', 'Quetta Campus — 0300-7890123'],
    },
    {
      id: 'card-3',
      title: 'KPK & Northern Areas',
      icon: 'Building2',
      items: ['Peshawar Campus — 0300-8901234', 'Abbottabad Campus — 0300-9012345', 'Gilgit Campus — 0300-0123456'],
    },
    {
      id: 'card-4',
      title: 'Admin & Support',
      icon: 'Headphones',
      items: ['Head Office: Islamabad', 'info@pakturkschools.edu.pk', 'Helpdesk: 051-1234567', 'Office hours: 8AM–4PM PKT'],
    },
  ],
  quickLinks: [
    { id: 'ql-1', label: 'Browse Dashboards', route: '/dashboards' },
    { id: 'ql-2', label: 'Student Enrollment', route: '/dashboard/executive-overview' },
    { id: 'ql-3', label: 'Financial Reports', route: '/dashboard/budget-vs-actual' },
  ],
};
