import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// Animated number counter
function AnimatedValue({ value }: { value: string }) {
  const [displayed, setDisplayed] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    if (prevRef.current !== value) {
      setDisplayed(value);
      prevRef.current = value;
    }
  }, [value]);

  return <span>{displayed}</span>;
}

interface KpiCardProps {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  className?: string;
  icon?: React.ReactNode;
  gradient?: string;
}

export function KpiCard({ label, value, change, positive, className, icon, gradient }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card p-4 sm:p-5 space-y-2 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5",
        className
      )}
    >
      {/* Subtle gradient overlay */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        gradient || "bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
      )} />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-card-foreground tracking-tight">
            <AnimatedValue value={value} />
          </p>
        </div>
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
      </div>
      
      {change && (
        <div className={cn('relative flex items-center gap-1.5 text-xs font-semibold',
          positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'
        )}>
          <div className={cn(
            'flex items-center justify-center w-5 h-5 rounded-full',
            positive ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-destructive/10'
          )}>
            {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          </div>
          {change} vs last year
        </div>
      )}
    </motion.div>
  );
}

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  subtitle?: string;
}

export function ChartCard({ title, children, className, action, subtitle }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        "rounded-2xl border bg-card p-5 sm:p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5",
        className
      )}
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-card-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  );
}

interface TableCardProps {
  title: string;
  headers: string[];
  rows: (string | React.ReactNode)[][];
  className?: string;
}

export function TableCard({ title, headers, rows, className }: TableCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn("rounded-2xl border bg-card p-5 sm:p-6", className)}
    >
      <h3 className="text-sm font-bold text-card-foreground mb-5">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-border">
              {headers.map(h => (
                <th key={h} className="text-left py-3 px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                className="border-b border-border/50 last:border-0 hover:bg-primary/[0.03] transition-colors"
              >
                {row.map((cell, j) => (
                  <td key={j} className="py-3 px-3 text-card-foreground font-medium">{cell}</td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Compliant: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800/50',
    Complete: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800/50',
    'In Progress': 'bg-primary/10 text-primary ring-1 ring-primary/20',
    'Action Needed': 'bg-destructive/10 text-destructive ring-1 ring-destructive/20',
    Pending: 'bg-muted text-muted-foreground ring-1 ring-border',
    High: 'bg-destructive/10 text-destructive ring-1 ring-destructive/20',
    Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800/50',
    Low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800/50',
    'Due Soon': 'bg-destructive/10 text-destructive ring-1 ring-destructive/20',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider',
      styles[status] || 'bg-muted text-muted-foreground ring-1 ring-border'
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', {
        'bg-emerald-500': status === 'Compliant' || status === 'Complete' || status === 'Low',
        'bg-primary': status === 'In Progress',
        'bg-destructive': status === 'Action Needed' || status === 'High' || status === 'Due Soon',
        'bg-amber-500': status === 'Medium',
        'bg-muted-foreground': status === 'Pending',
      })} />
      {status}
    </span>
  );
}

// Progress ring component
interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: string;
}

export function ProgressRing({ value, size = 120, strokeWidth = 10, label, color }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color || "hsl(var(--primary))"}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-card-foreground">{value}%</span>
        </div>
      </div>
      {label && <span className="text-xs font-medium text-muted-foreground">{label}</span>}
    </div>
  );
}

// Sparkline mini chart
interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}

export function Sparkline({ data, color = 'hsl(var(--primary))', height = 32, width = 80 }: SparklineProps) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-${color.replace(/[^a-z0-9]/g, '')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#spark-${color.replace(/[^a-z0-9]/g, '')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
