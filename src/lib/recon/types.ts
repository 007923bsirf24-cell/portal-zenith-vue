// =============================================================================
// RECONCILIATION DOMAIN TYPES
// =============================================================================

export interface ChartOfAccount {
  Company: string;
  AcctCode: string;
  AcctName: string;
  GroupMask: string;
  FatherNum: string;
  Levels: number;
  Postable: boolean;
  CreatedDate: string;
}

export interface GeneralLedgerRow {
  id: string;
  Company: string;
  PostingDate: string;        // ISO yyyy-mm-dd
  TransId: string;
  JournalEntryNo: string;
  JE_Memo: string;
  LineID: number;
  AccountCode: string;
  Debit: number;
  Credit: number;
  Net: number;                // Debit - Credit
  ShortName: string;
}

/** Admin mapping that flags an account as inter-company and links it to a campus. */
export interface IntercompanyMapping {
  id: string;
  company: string;            // company that owns this CoA row
  acctCode: string;
  acctName: string;
  fatherNum: string;
  levels: number;
  postable: boolean;
  linkedCompany: string | null;   // counterpart campus/company code
  accountType: 'head_office' | 'campus' | 'other';
  active: boolean;
  /** Manual override flag — if true the row is intercompany even when name does not match */
  manualOverride: boolean;
  updatedAt: string;
}

export type MatchStatus =
  | 'pending'
  | 'suggested'
  | 'possible'
  | 'exact'
  | 'difference'
  | 'unmatched'
  | 'reconciled';

export type PeriodStatus = 'draft' | 'submitted' | 'reviewed' | 'closed';

export interface ReconciledLine {
  id: string;
  reconciliationPeriodId: string;
  hoLedgerId: string;
  campusLedgerId: string;
  hoCompany: string;
  campusCompany: string;
  hoPostingDate: string;
  campusPostingDate: string;
  hoTransId: string;
  campusTransId: string;
  hoJournalEntryNo: string;
  campusJournalEntryNo: string;
  hoLineId: number;
  campusLineId: number;
  hoAccountCode: string;
  campusAccountCode: string;
  hoAccountName: string;
  campusAccountName: string;
  hoDebit: number;
  hoCredit: number;
  hoNet: number;
  campusDebit: number;
  campusCredit: number;
  campusNet: number;
  amountMatched: number;
  differenceAmount: number;
  matchStatus: MatchStatus;
  reconciledByUserId: string;
  reconciledByUserName: string;
  reconciledAt: string;
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReconciliationPeriod {
  id: string;                 // `${hoCompany}__${campusCompany}__${YYYY-MM}`
  hoCompany: string;
  campusCompany: string;
  periodMonth: string;        // 'YYYY-MM'
  fiscalYear: string;         // 'FYxx-yy'
  status: PeriodStatus;
  preparedByUserId: string | null;
  submittedByUserId: string | null;
  reviewedByUserId: string | null;
  closedByUserId: string | null;
  preparedAt: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  closedAt: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReconAuditEntry {
  id: string;
  action: string;
  userId: string;
  userName: string;
  userRole: string;
  timestamp: string;
  hoLedgerId?: string;
  campusLedgerId?: string;
  hoCompany?: string;
  campusCompany?: string;
  periodMonth?: string;
  fiscalYear?: string;
  oldStatus?: string;
  newStatus?: string;
  remarks?: string;
}

export const STATUS_LABELS: Record<MatchStatus, string> = {
  pending: 'Pending',
  suggested: 'Suggested',
  possible: 'Possible',
  exact: 'Exact Match',
  difference: 'Difference',
  unmatched: 'Unmatched',
  reconciled: 'Reconciled',
};

export const PERIOD_STATUS_LABELS: Record<PeriodStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  reviewed: 'Reviewed',
  closed: 'Closed',
};
