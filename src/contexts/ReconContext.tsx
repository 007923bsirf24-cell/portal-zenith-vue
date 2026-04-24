import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  IntercompanyMapping, ReconciledLine, ReconciliationPeriod,
  ReconAuditEntry, PeriodStatus, MatchStatus, GeneralLedgerRow,
} from '@/lib/recon/types';
import { SAMPLE_CHART_OF_ACCOUNTS, SAMPLE_GENERAL_LEDGER } from '@/lib/recon/sampleData';
import { buildMappings } from '@/lib/recon/intercompany';
import { classifyManual } from '@/lib/recon/matching';
import { saveToStorage, loadFromStorage } from '@/lib/storage';
import { saveToCloud, loadFromCloud } from '@/lib/cloudStorage';
import { useAuth } from '@/contexts/AuthContext';

const KEYS = {
  MAPPING_OVERRIDES: 'frh-recon-mapping-overrides',
  RECONCILED:        'frh-recon-reconciled-lines',
  PERIODS:           'frh-recon-periods',
  AUDIT:             'frh-recon-audit',
};

interface ReconContextType {
  // Reference data
  chartOfAccounts: typeof SAMPLE_CHART_OF_ACCOUNTS;
  generalLedger:   GeneralLedgerRow[];

  // Mapping
  mappings: IntercompanyMapping[];
  updateMapping: (id: string, updates: Partial<IntercompanyMapping>) => void;
  addManualMapping: (m: IntercompanyMapping) => void;
  resetMappings: () => void;

  // Periods
  periods: ReconciliationPeriod[];
  getOrCreatePeriod: (hoCompany: string, campusCompany: string, periodMonth: string) => ReconciliationPeriod;
  setPeriodStatus: (id: string, status: PeriodStatus) => void;

  // Reconciled lines
  reconciledLines: ReconciledLine[];
  reconcilePair: (
    periodId: string,
    ho: GeneralLedgerRow,
    campus: GeneralLedgerRow,
    status: MatchStatus,
    matched: number,
    difference: number,
    remarks?: string,
  ) => void;
  unreconcile: (lineId: string) => void;
  updateRemarks: (lineId: string, remarks: string) => void;

  // Audit
  auditTrail: ReconAuditEntry[];
  addAudit: (entry: Omit<ReconAuditEntry, 'id' | 'timestamp' | 'userId' | 'userName' | 'userRole'>) => void;
  clearAudit: () => void;
}

const ReconContext = createContext<ReconContextType | undefined>(undefined);

function persist(key: string, value: unknown) {
  saveToStorage(key, value);
  saveToCloud(key, value);
}

export function ReconProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, companies } = useAuth();

  const companyCodes = useMemo(() => companies.map(c => c.code), [companies]);

  const [overrides, setOverrides] = useState<Record<string, Partial<IntercompanyMapping>>>(() =>
    loadFromStorage(KEYS.MAPPING_OVERRIDES, {})
  );
  const [periods, setPeriods] = useState<ReconciliationPeriod[]>(() =>
    loadFromStorage(KEYS.PERIODS, [])
  );
  const [reconciledLines, setReconciledLines] = useState<ReconciledLine[]>(() =>
    loadFromStorage(KEYS.RECONCILED, [])
  );
  const [auditTrail, setAuditTrail] = useState<ReconAuditEntry[]>(() =>
    loadFromStorage(KEYS.AUDIT, [])
  );

  // Hydrate from cloud once
  useEffect(() => {
    (async () => {
      const [o, p, r, a] = await Promise.all([
        loadFromCloud<Record<string, Partial<IntercompanyMapping>> | null>(KEYS.MAPPING_OVERRIDES, null),
        loadFromCloud<ReconciliationPeriod[] | null>(KEYS.PERIODS, null),
        loadFromCloud<ReconciledLine[] | null>(KEYS.RECONCILED, null),
        loadFromCloud<ReconAuditEntry[] | null>(KEYS.AUDIT, null),
      ]);
      if (o) { setOverrides(o); saveToStorage(KEYS.MAPPING_OVERRIDES, o); }
      if (p) { setPeriods(p); saveToStorage(KEYS.PERIODS, p); }
      if (r) { setReconciledLines(r); saveToStorage(KEYS.RECONCILED, r); }
      if (a) { setAuditTrail(a); saveToStorage(KEYS.AUDIT, a); }
    })();
  }, []);

  const mappings = useMemo(
    () => buildMappings(SAMPLE_CHART_OF_ACCOUNTS, companyCodes, overrides),
    [companyCodes, overrides],
  );

  const addAudit = useCallback<ReconContextType['addAudit']>((entry) => {
    setAuditTrail(prev => {
      const newEntry: ReconAuditEntry = {
        ...entry,
        id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toISOString(),
        userId: currentUser?.id ?? 'system',
        userName: currentUser?.fullName ?? 'System',
        userRole: currentUser?.role ?? 'system',
      };
      const next = [newEntry, ...prev].slice(0, 2000);
      persist(KEYS.AUDIT, next);
      return next;
    });
  }, [currentUser]);

  const updateMapping = useCallback<ReconContextType['updateMapping']>((id, updates) => {
    setOverrides(prev => {
      const next = { ...prev, [id]: { ...(prev[id] ?? {}), ...updates } };
      persist(KEYS.MAPPING_OVERRIDES, next);
      return next;
    });
    addAudit({ action: 'mapping_updated', remarks: `Mapping ${id} updated` });
  }, [addAudit]);

  const addManualMapping = useCallback<ReconContextType['addManualMapping']>((m) => {
    setOverrides(prev => {
      const next = { ...prev, [m.id]: { ...m, manualOverride: true } };
      persist(KEYS.MAPPING_OVERRIDES, next);
      return next;
    });
    addAudit({ action: 'mapping_added', remarks: `Manual mapping ${m.id}` });
  }, [addAudit]);

  const resetMappings = useCallback(() => {
    setOverrides({});
    persist(KEYS.MAPPING_OVERRIDES, {});
    addAudit({ action: 'mapping_reset' });
  }, [addAudit]);

  const getOrCreatePeriod = useCallback<ReconContextType['getOrCreatePeriod']>(
    (hoCompany, campusCompany, periodMonth) => {
      const id = `${hoCompany}__${campusCompany}__${periodMonth}`;
      const found = periods.find(p => p.id === id);
      if (found) return found;
      const fyStart = Number(periodMonth.slice(0, 4));
      const month = Number(periodMonth.slice(5, 7));
      const fyA = month >= 7 ? fyStart : fyStart - 1;
      const fy = `FY${String(fyA).slice(2)}-${String(fyA + 1).slice(2)}`;
      const period: ReconciliationPeriod = {
        id, hoCompany, campusCompany, periodMonth,
        fiscalYear: fy, status: 'draft',
        preparedByUserId: currentUser?.id ?? null,
        submittedByUserId: null, reviewedByUserId: null, closedByUserId: null,
        preparedAt: new Date().toISOString(),
        submittedAt: null, reviewedAt: null, closedAt: null,
        notes: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      setPeriods(prev => {
        const next = [...prev, period];
        persist(KEYS.PERIODS, next);
        return next;
      });
      addAudit({
        action: 'period_created', hoCompany, campusCompany,
        periodMonth, fiscalYear: fy, newStatus: 'draft',
      });
      return period;
    },
    [periods, currentUser, addAudit],
  );

  const setPeriodStatus = useCallback<ReconContextType['setPeriodStatus']>((id, status) => {
    setPeriods(prev => {
      const next = prev.map(p => {
        if (p.id !== id) return p;
        const stamp = new Date().toISOString();
        const updates: Partial<ReconciliationPeriod> = { status, updatedAt: stamp };
        if (status === 'submitted') { updates.submittedByUserId = currentUser?.id ?? null; updates.submittedAt = stamp; }
        if (status === 'reviewed')  { updates.reviewedByUserId  = currentUser?.id ?? null; updates.reviewedAt  = stamp; }
        if (status === 'closed')    { updates.closedByUserId    = currentUser?.id ?? null; updates.closedAt    = stamp; }
        return { ...p, ...updates };
      });
      persist(KEYS.PERIODS, next);
      const p = next.find(x => x.id === id);
      addAudit({
        action: `period_${status}`, hoCompany: p?.hoCompany, campusCompany: p?.campusCompany,
        periodMonth: p?.periodMonth, fiscalYear: p?.fiscalYear, newStatus: status,
      });
      return next;
    });
  }, [currentUser, addAudit]);

  const reconcilePair = useCallback<ReconContextType['reconcilePair']>(
    (periodId, ho, campus, status, matched, difference, remarks = '') => {
      setReconciledLines(prev => {
        // Prevent duplicates
        if (prev.some(l => l.hoLedgerId === ho.id || l.campusLedgerId === campus.id)) {
          return prev;
        }
        const stamp = new Date().toISOString();
        const acctName = (code: string, company: string) =>
          SAMPLE_CHART_OF_ACCOUNTS.find(a => a.Company === company && a.AcctCode === code)?.AcctName ?? code;
        const line: ReconciledLine = {
          id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          reconciliationPeriodId: periodId,
          hoLedgerId: ho.id, campusLedgerId: campus.id,
          hoCompany: ho.Company, campusCompany: campus.Company,
          hoPostingDate: ho.PostingDate, campusPostingDate: campus.PostingDate,
          hoTransId: ho.TransId, campusTransId: campus.TransId,
          hoJournalEntryNo: ho.JournalEntryNo, campusJournalEntryNo: campus.JournalEntryNo,
          hoLineId: ho.LineID, campusLineId: campus.LineID,
          hoAccountCode: ho.AccountCode, campusAccountCode: campus.AccountCode,
          hoAccountName: acctName(ho.AccountCode, ho.Company),
          campusAccountName: acctName(campus.AccountCode, campus.Company),
          hoDebit: ho.Debit, hoCredit: ho.Credit, hoNet: ho.Net,
          campusDebit: campus.Debit, campusCredit: campus.Credit, campusNet: campus.Net,
          amountMatched: matched, differenceAmount: difference,
          matchStatus: status,
          reconciledByUserId: currentUser?.id ?? 'unknown',
          reconciledByUserName: currentUser?.fullName ?? 'Unknown',
          reconciledAt: stamp, remarks,
          createdAt: stamp, updatedAt: stamp,
        };
        const next = [line, ...prev];
        persist(KEYS.RECONCILED, next);
        return next;
      });
      addAudit({
        action: 'transactions_reconciled',
        hoLedgerId: ho.id, campusLedgerId: campus.id,
        hoCompany: ho.Company, campusCompany: campus.Company,
        newStatus: status, remarks,
      });
    },
    [currentUser, addAudit],
  );

  const unreconcile = useCallback<ReconContextType['unreconcile']>((lineId) => {
    setReconciledLines(prev => {
      const target = prev.find(l => l.id === lineId);
      const next = prev.filter(l => l.id !== lineId);
      persist(KEYS.RECONCILED, next);
      if (target) {
        addAudit({
          action: 'transactions_unreconciled',
          hoLedgerId: target.hoLedgerId, campusLedgerId: target.campusLedgerId,
          hoCompany: target.hoCompany, campusCompany: target.campusCompany,
        });
      }
      return next;
    });
  }, [addAudit]);

  const updateRemarks = useCallback<ReconContextType['updateRemarks']>((lineId, remarks) => {
    setReconciledLines(prev => {
      const next = prev.map(l => l.id === lineId ? { ...l, remarks, updatedAt: new Date().toISOString() } : l);
      persist(KEYS.RECONCILED, next);
      return next;
    });
    addAudit({ action: 'remarks_changed', remarks });
  }, [addAudit]);

  const clearAudit = useCallback(() => {
    setAuditTrail([]);
    persist(KEYS.AUDIT, []);
  }, []);

  const value: ReconContextType = {
    chartOfAccounts: SAMPLE_CHART_OF_ACCOUNTS,
    generalLedger: SAMPLE_GENERAL_LEDGER,
    mappings, updateMapping, addManualMapping, resetMappings,
    periods, getOrCreatePeriod, setPeriodStatus,
    reconciledLines, reconcilePair, unreconcile, updateRemarks,
    auditTrail, addAudit, clearAudit,
  };

  return <ReconContext.Provider value={value}>{children}</ReconContext.Provider>;
}

export function useRecon() {
  const ctx = useContext(ReconContext);
  if (!ctx) throw new Error('useRecon must be used within ReconProvider');
  return ctx;
}
