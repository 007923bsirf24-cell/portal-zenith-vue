import { Dashboard } from '@/data/dashboards';
import { ExecutiveDashboard } from './ExecutiveDashboard';
import { BudgetDashboard } from './BudgetDashboard';
import { FeesDashboard } from './FeesDashboard';
import { CashDashboard } from './CashDashboard';
import { PayrollDashboard } from './PayrollDashboard';
import { ProcurementDashboard } from './ProcurementDashboard';
import { APDashboard } from './APDashboard';
import { CapexDashboard } from './CapexDashboard';
import { ComplianceDashboard } from './ComplianceDashboard';
import { ClosePackDashboard } from './ClosePackDashboard';

const CATEGORY_MAP: Record<string, React.FC> = {
  Executive: ExecutiveDashboard,
  Budget: BudgetDashboard,
  'Fees/Receivables': FeesDashboard,
  Cash: CashDashboard,
  Payroll: PayrollDashboard,
  Procurement: ProcurementDashboard,
  AP: APDashboard,
  Capex: CapexDashboard,
  Compliance: ComplianceDashboard,
  'Close Pack': ClosePackDashboard,
};

interface Props {
  dashboard: Dashboard;
}

export function StaticDashboard({ dashboard }: Props) {
  const Component = CATEGORY_MAP[dashboard.category];

  if (!Component) {
    return (
      <div className="flex items-center justify-center py-20 text-center">
        <p className="text-muted-foreground">No prototype available for this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Prototype — Static Data
        </span>
        <span className="text-xs text-muted-foreground">This view will be replaced when a live embed URL is configured.</span>
      </div>
      <Component />
    </div>
  );
}
