import { icons } from 'lucide-react';

type IconComponentType = React.ComponentType<{ size?: number; className?: string }>;

interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
}

export function DynamicIcon({ name, size = 24, className }: DynamicIconProps) {
  const iconMap = icons as Record<string, IconComponentType>;
  const IconComp = iconMap[name];
  if (!IconComp) {
    const Fallback = iconMap['LayoutDashboard'];
    return Fallback ? <Fallback size={size} className={className} /> : null;
  }
  return <IconComp size={size} className={className} />;
}
