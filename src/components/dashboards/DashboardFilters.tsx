import { useState } from 'react';
import { CAMPUSES, ACADEMIC_YEARS, QUARTERS } from '@/data/dummyDashboardData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, CalendarDays, Filter } from 'lucide-react';

interface DashboardFiltersProps {
  campus: string;
  setCampus: (v: string) => void;
  showQuarter?: boolean;
  quarter?: string;
  setQuarter?: (v: string) => void;
  showYear?: boolean;
  year?: string;
  setYear?: (v: string) => void;
  extra?: React.ReactNode;
}

export function DashboardFilters({
  campus, setCampus,
  showQuarter, quarter, setQuarter,
  showYear = true, year, setYear,
  extra,
}: DashboardFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border bg-card">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Filter size={14} />
        Filters
      </div>
      <div className="h-5 w-px bg-border" />
      <div className="flex items-center gap-2">
        <Building2 size={14} className="text-muted-foreground" />
        <Select value={campus} onValueChange={setCampus}>
          <SelectTrigger className="h-8 w-[160px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CAMPUSES.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {showYear && setYear && year && (
        <div className="flex items-center gap-2">
          <CalendarDays size={14} className="text-muted-foreground" />
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="h-8 w-[120px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACADEMIC_YEARS.map(y => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {showQuarter && setQuarter && quarter && (
        <Select value={quarter} onValueChange={setQuarter}>
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Quarters">All Quarters</SelectItem>
            {QUARTERS.map(q => (
              <SelectItem key={q} value={q}>{q}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {extra}
    </div>
  );
}

// Hook for common filter state
export function useDashboardFilters() {
  const [campus, setCampus] = useState<string>('All Campuses');
  const [year, setYear] = useState<string>('2025-26');
  const [quarter, setQuarter] = useState<string>('All Quarters');

  const activeCampus = campus === 'All Campuses' ? 'Islamabad' : campus;

  return { campus, setCampus, year, setYear, quarter, setQuarter, activeCampus };
}
