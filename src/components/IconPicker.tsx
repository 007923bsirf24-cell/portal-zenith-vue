import { useState, useMemo } from 'react';
import { DynamicIcon } from './DynamicIcon';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const ICON_LIST = [
  'Activity', 'AlertCircle', 'Archive', 'ArrowUpRight', 'Award',
  'Banknote', 'BarChart', 'BarChart2', 'BarChart3',
  'BookOpen', 'Briefcase', 'Building', 'Building2', 'Calculator',
  'Calendar', 'CheckCircle', 'CircleDollarSign', 'Clipboard', 'Clock',
  'Coins', 'CreditCard', 'Crown', 'Database', 'DollarSign', 'GraduationCap',
  'Download', 'Eye', 'FileBarChart', 'FileCheck', 'FileSpreadsheet',
  'FileText', 'Filter', 'Flag', 'FolderOpen', 'Globe',
  'HandCoins', 'Hash', 'Heart', 'Home', 'Inbox',
  'Landmark', 'Layers', 'LayoutDashboard', 'LineChart', 'List',
  'Lock', 'Mail', 'Map', 'MessageSquare', 'Monitor',
  'Package', 'PackageCheck', 'Percent', 'PieChart', 'PiggyBank',
  'Receipt', 'RefreshCw', 'Scale', 'Search', 'Settings',
  'Shield', 'ShieldCheck', 'ShoppingCart', 'Star', 'Table',
  'Tag', 'Target', 'TrendingDown', 'TrendingUp', 'Trophy',
  'Upload', 'UserPlus', 'Users', 'Wallet', 'Zap',
];

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return ICON_LIST;
    const q = search.toLowerCase();
    return ICON_LIST.filter(name => name.toLowerCase().includes(q));
  }, [search]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
          <DynamicIcon name={value || 'LayoutDashboard'} size={24} />
        </div>
        <div className="flex-1">
          <Input
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
          />
        </div>
      </div>
      <ScrollArea className="h-48 rounded-lg border p-2">
        <div className="grid grid-cols-8 gap-1">
          {filtered.map(name => (
            <button
              key={name}
              type="button"
              onClick={() => onChange(name)}
              className={cn(
                'flex items-center justify-center p-2 rounded-lg transition-all hover:bg-primary/10',
                value === name && 'bg-primary/15 text-primary ring-1 ring-primary/30'
              )}
              title={name}
            >
              <DynamicIcon name={name} size={18} />
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-8 text-center text-sm text-muted-foreground py-4">No icons found</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
