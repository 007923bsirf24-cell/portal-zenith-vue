import { Link } from 'react-router-dom';
import { Dashboard, CATEGORY_ICON_FALLBACKS } from '@/data/dashboards';
import { DynamicIcon } from './DynamicIcon';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

interface DashboardCardProps {
  dashboard: Dashboard;
  className?: string;
}

export function DashboardCard({ dashboard, className }: DashboardCardProps) {
  const iconName = dashboard.iconName || CATEGORY_ICON_FALLBACKS[dashboard.category] || 'LayoutDashboard';

  return (
    <Link
      to={`/dashboard/${dashboard.id}`}
      className={cn(
        'group block rounded-2xl border bg-card p-6 transition-all duration-300',
        'hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
          <DynamicIcon name={iconName} size={22} />
        </div>
        <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <h3 className="font-semibold text-card-foreground mb-1.5 line-clamp-1">{dashboard.title}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{dashboard.description}</p>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {dashboard.category}
        </span>
        <span className={cn(
          'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
          dashboard.status === 'Live Data'
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
        )}>
          <span className={cn(
            'w-1.5 h-1.5 rounded-full',
            dashboard.status === 'Live Data' ? 'bg-emerald-500' : 'bg-amber-500'
          )} />
          {dashboard.status}
        </span>
      </div>

      {dashboard.tags.length > 0 && (
        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          {dashboard.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-md text-xs bg-muted text-muted-foreground">
              {tag}
            </span>
          ))}
          {dashboard.tags.length > 3 && (
            <span className="text-xs text-muted-foreground">+{dashboard.tags.length - 3}</span>
          )}
        </div>
      )}
    </Link>
  );
}
