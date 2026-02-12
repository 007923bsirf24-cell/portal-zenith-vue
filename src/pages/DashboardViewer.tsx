import { useParams, Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { DynamicIcon } from '@/components/DynamicIcon';
import { StaticDashboard } from '@/components/dashboards/StaticDashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, ExternalLink, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const DashboardViewer = () => {
  const { id } = useParams<{ id: string }>();
  const { dashboards, addRecentlyOpened } = useApp();
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const { toast } = useToast();

  const dashboard = dashboards.find(d => d.id === id);

  useEffect(() => {
    if (id && dashboard) {
      addRecentlyOpened(id);
    }
  }, [id]);

  if (!dashboard) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Dashboard Not Found</h1>
        <p className="text-muted-foreground mb-6">The dashboard you're looking for doesn't exist or has been removed.</p>
        <Button asChild variant="outline">
          <Link to="/dashboards">
            <ArrowLeft size={16} />
            Back to Gallery
          </Link>
        </Button>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: 'Link copied', description: 'Dashboard link copied to clipboard.' });
  };

  const handleOpenNewTab = () => {
    if (dashboard.embedUrl) {
      window.open(dashboard.embedUrl, '_blank');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
        <Link to="/dashboards">
          <ArrowLeft size={16} />
          Back to Gallery
        </Link>
      </Button>

      <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
        <div className="bg-primary/5 border-b px-6 py-5 sm:px-8 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary shrink-0">
                <DynamicIcon name={dashboard.iconName || 'LayoutDashboard'} size={22} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-card-foreground">{dashboard.title}</h1>
                <p className="text-sm text-muted-foreground mt-0.5">{dashboard.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-muted-foreground">
                    Category: <span className="font-medium text-foreground">{dashboard.category}</span>
                  </span>
                  <span className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
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
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={handleCopyLink}>
                <Copy size={14} />
                Copy Link
              </Button>
              {dashboard.embedUrl && (
                <Button variant="outline" size="sm" onClick={handleOpenNewTab}>
                  <ExternalLink size={14} />
                  Open in New Tab
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {!dashboard.embedUrl ? (
            <StaticDashboard dashboard={dashboard} />
          ) : (
            <div className="relative rounded-xl overflow-hidden bg-muted" style={{ minHeight: '600px' }}>
              {!iframeLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="space-y-3 text-center">
                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground">Loading dashboard...</p>
                  </div>
                </div>
              )}
              <iframe
                src={dashboard.embedUrl}
                className={cn(
                  'w-full border-0 rounded-xl transition-opacity duration-300',
                  iframeLoaded ? 'opacity-100' : 'opacity-0'
                )}
                style={{ height: '700px' }}
                onLoad={() => setIframeLoaded(true)}
                title={dashboard.title}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardViewer;
