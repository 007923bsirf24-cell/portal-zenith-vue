import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

export default function IntercompanyReconciliation() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Inter-Company Reconciliation</h1>
        <p className="text-muted-foreground mt-1">Mirror-effect reconciliation between Head Office and campuses</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction size={18} className="text-primary" /> Coming in Stage 2
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Stage 1 (Auth, Users, Campuses, Permissions) is now live. The full reconciliation workspace —
            with mirror-effect matching, side-by-side ledger views, monthly close workflow, and audit trail —
            will be delivered next.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
