import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { DashboardCard } from '@/components/DashboardCard';
import { CATEGORIES } from '@/data/dashboards';
import { Input } from '@/components/ui/input';
import { Search, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS = ['All', 'Live Data', 'Preview'];

const Dashboards = () => {
  const { dashboards, recentlyOpened } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');

  const filtered = useMemo(() => {
    let result = dashboards;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (category !== 'All') {
      result = result.filter(d => d.category === category);
    }
    if (status !== 'All') {
      result = result.filter(d => d.status === status);
    }
    return result;
  }, [dashboards, search, category, status]);

  const recentDashboards = useMemo(() => {
    return recentlyOpened
      .map(id => dashboards.find(d => d.id === id))
      .filter(Boolean) as typeof dashboards;
  }, [recentlyOpened, dashboards]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard Gallery</h1>
        <p className="text-muted-foreground mt-1">Browse and access all available finance dashboards</p>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by title, description, or tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11 rounded-xl"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setCategory('All')}
          className={cn(
            'px-3.5 py-1.5 rounded-full text-sm font-medium transition-all',
            category === 'All'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-muted text-muted-foreground hover:text-foreground'
          )}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-sm font-medium transition-all',
              category === cat
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-8">
        {STATUS_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={cn(
              'px-3 py-1 rounded-lg text-xs font-medium transition-all border',
              status === s
                ? 'border-primary/30 bg-primary/10 text-primary'
                : 'border-transparent bg-muted/50 text-muted-foreground hover:text-foreground'
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {recentDashboards.length > 0 && !search && category === 'All' && status === 'All' && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-muted-foreground" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recently Opened</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentDashboards.slice(0, 4).map(d => (
              <DashboardCard key={d.id} dashboard={d} />
            ))}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(d => (
          <DashboardCard key={d.id} dashboard={d} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No dashboards found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboards;
