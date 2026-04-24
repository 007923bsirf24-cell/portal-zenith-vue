import { Outlet, useNavigate } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessSettings, canPerformReconciliation } from '@/lib/auth/permissions';
import { ROLE_LABELS } from '@/lib/auth/types';
import { Moon, Sun, Menu, LogOut, Settings as SettingsIcon, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { NAVBAR } from '@/config/site.config';
import logoImg from '@/assets/logo.png';
import { toast } from 'sonner';

export function Layout() {
  const { darkMode, toggleDarkMode } = useApp();
  const { currentUser, logout, rolePermissions } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const showSettings = canAccessSettings(currentUser, rolePermissions);
  const showRecon = canPerformReconciliation(currentUser, rolePermissions)
    || (currentUser?.role && ['super_admin','cfo','finance_director','manager','head_office','director'].includes(currentUser.role));

  const navItems = [
    { label: 'Home', to: '/', show: true, end: true },
    { label: 'Dashboards', to: '/dashboards', show: true },
    { label: 'Reconciliation', to: '/intercompany-reconciliation', show: !!showRecon },
  ].filter(i => i.show);

  const initials = currentUser
    ? currentUser.fullName.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
            {NAVBAR.showLogo ? <img src={logoImg} alt="Logo" className="h-8 w-8 object-contain" /> : null}
            <span className="font-semibold text-foreground hidden sm:block">{NAVBAR.appName}</span>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1 bg-muted rounded-full p-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className="px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground transition-all hover:text-foreground"
                activeClassName="bg-primary text-primary-foreground shadow-sm hover:text-primary-foreground"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full" aria-label="Toggle dark mode">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </Button>

            {currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-muted transition-colors">
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                      {initials}
                    </div>
                    <div className="hidden lg:flex flex-col items-start leading-tight">
                      <span className="text-xs font-medium text-foreground">{currentUser.fullName}</span>
                      <span className="text-[10px] text-muted-foreground">{ROLE_LABELS[currentUser.role]}</span>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">{currentUser.fullName}</span>
                      <span className="text-xs text-muted-foreground font-normal">@{currentUser.username}</span>
                      <Badge variant="secondary" className="mt-2 w-fit">{ROLE_LABELS[currentUser.role]}</Badge>
                      <span className="text-xs text-muted-foreground mt-1.5">
                        {currentUser.companies === '*' ? 'All companies' : `${currentUser.companies.length} companies`}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {showSettings && (
                    <DropdownMenuItem onClick={() => navigate('/settings')} className="gap-2">
                      <SettingsIcon size={14} /> Settings
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                      toast.success('Signed out');
                      navigate('/login');
                    }}
                    className="gap-2 text-destructive focus:text-destructive"
                  >
                    <LogOut size={14} /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden rounded-full"><Menu size={18} /></Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col gap-2 mt-8">
                  {navItems.map(item => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground transition-all hover:bg-muted"
                      activeClassName="bg-primary text-primary-foreground hover:bg-primary"
                    >
                      {item.label}
                    </NavLink>
                  ))}
                  {showSettings && (
                    <NavLink
                      to="/settings"
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground transition-all hover:bg-muted"
                      activeClassName="bg-primary text-primary-foreground hover:bg-primary"
                    >
                      Settings
                    </NavLink>
                  )}
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
