import { Outlet } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import { useApp } from '@/contexts/AppContext';
import { Moon, Sun, Menu, LayoutDashboard, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Dashboards', to: '/dashboards' },
  { label: 'Settings', to: '/settings' },
];

export function Layout() {
  const { orgName, logoUrl, darkMode, toggleDarkMode } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt={orgName} className="h-8 w-8 rounded-lg object-cover" />
            ) : (
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground">
                <LayoutDashboard size={18} />
              </div>
            )}
            <span className="font-semibold text-foreground hidden sm:block">{orgName}</span>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1 bg-muted rounded-full p-1">
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className="px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground transition-all hover:text-foreground"
                activeClassName="bg-primary text-primary-foreground shadow-sm hover:text-primary-foreground"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </Button>

            <div className="hidden sm:flex items-center justify-center h-8 w-8 rounded-full bg-muted text-muted-foreground">
              <User size={16} />
            </div>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                  <Menu size={18} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col gap-2 mt-8">
                  {NAV_ITEMS.map(item => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/'}
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground transition-all hover:bg-muted"
                      activeClassName="bg-primary text-primary-foreground hover:bg-primary"
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
