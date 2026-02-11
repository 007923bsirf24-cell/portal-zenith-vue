import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { DashboardCard } from '@/components/DashboardCard';
import { DynamicIcon } from '@/components/DynamicIcon';
import { Button } from '@/components/ui/button';
import {
  Shield, Users, Lock, LayoutDashboard, ArrowRight,
  Headphones, Newspaper, Lightbulb, ChevronRight,
} from 'lucide-react';

const Index = () => {
  const { orgName, dashboards } = useApp();
  const featured = dashboards.filter(d => d.featured);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-mesh" />
        <div className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-primary/10 blur-[100px] animate-float" />
        <div className="absolute top-40 right-0 w-[500px] h-[500px] rounded-full bg-accent/8 blur-[120px] animate-float-slow" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-primary/5 blur-[80px] animate-pulse-glow" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left: Hero content */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                  Your single source{' '}
                  <span className="text-gradient">of truth</span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed">
                  Centralized access to all {orgName} dashboards — secure, governed, and always up to date.
                </p>
              </div>

              {/* Trust pills */}
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Shield, label: 'Org-secure access' },
                  { icon: Users, label: 'Role-based permissions' },
                  { icon: Lock, label: 'Confidential' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 px-3.5 py-2 rounded-full glass text-sm font-medium text-foreground">
                    <Icon size={14} className="text-primary" />
                    {label}
                  </div>
                ))}
              </div>

              {/* Quick action buttons */}
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="hero" size="lg">
                  <Link to="/dashboards">
                    <LayoutDashboard size={18} />
                    Browse Dashboards
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-xl">
                  <Link to="/dashboard/executive-overview">
                    Executive Overview
                    <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-xl">
                  <Link to="/dashboard/monthly-closing-pack">
                    Monthly Close Pack
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: Portal Preview */}
            <div className="hidden lg:block animate-slide-up-delayed">
              <div className="glass rounded-2xl p-6 space-y-5 shadow-xl shadow-primary/5">
                <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Portal Preview</h3>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Reports', value: String(dashboards.length), icon: 'FileBarChart' },
                    { label: 'Categories', value: '10', icon: 'Layers' },
                    { label: 'Last Updated', value: 'Today', icon: 'Clock' },
                    { label: 'Access', value: 'Org Only', icon: 'Lock' },
                  ].map(stat => (
                    <div key={stat.label} className="rounded-xl bg-background/80 p-3.5 space-y-1">
                      <DynamicIcon name={stat.icon} size={16} className="text-primary" />
                      <p className="text-lg font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {featured.slice(0, 3).map(d => (
                    <Link
                      key={d.id}
                      to={`/dashboard/${d.id}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-background/80 hover:bg-background transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <DynamicIcon name={d.iconName || 'LayoutDashboard'} size={16} className="text-primary" />
                        <span className="text-sm font-medium text-foreground">{d.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          d.status === 'Live Data'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${
                            d.status === 'Live Data' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`} />
                          {d.status}
                        </span>
                        <ChevronRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Shield,
              title: 'Data Governance',
              items: ['Org-secure, no public sharing', 'Role-based access control', 'Audit trail for all access'],
            },
            {
              icon: Headphones,
              title: 'Support & Contact',
              items: ['Finance Analytics Team', 'analytics@company.com', 'Office hours: 9AM–5PM EST'],
            },
            {
              icon: Newspaper,
              title: 'Release Notes',
              items: ['v3.2 — New cash forecast model', 'v3.1 — Compliance tracker added', 'v3.0 — Gallery redesign'],
            },
            {
              icon: Lightbulb,
              title: 'Usage Tips',
              items: ['Search dashboards by tags', 'Use category filters', 'Pin favorites (coming soon)'],
            },
          ].map(card => (
            <div key={card.title} className="rounded-2xl border bg-card p-6 space-y-4 transition-all hover:shadow-md hover:shadow-primary/5">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
                <card.icon size={20} />
              </div>
              <h3 className="font-semibold text-card-foreground">{card.title}</h3>
              <ul className="space-y-2">
                {card.items.map(item => (
                  <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary/40 mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Dashboards */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Featured Dashboards</h2>
              <p className="text-muted-foreground mt-1">Quick access to key financial reports</p>
            </div>
            <Button asChild variant="ghost" className="text-primary">
              <Link to="/dashboards">
                View all
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.slice(0, 4).map(d => (
              <DashboardCard key={d.id} dashboard={d} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
