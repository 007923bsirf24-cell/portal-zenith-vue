// =============================================================================
// MOCK CHART OF ACCOUNTS + GENERAL LEDGER
// Realistic intercompany activity between TMF_HO_OB and 24 campuses.
// Deterministic seed so reconciliation results are reproducible.
// =============================================================================

import { ChartOfAccount, GeneralLedgerRow } from './types';
import { SAMPLE_COMPANIES } from '@/lib/auth/sampleData';

const HO_CODE = 'TMF_HO_OB';

/** Friendly campus → CoA name mapping (matches user's brief) */
const CAMPUS_COA_NAMES: Record<string, string> = {
  TMF_HO_OB: 'Inter - Company A/c Head Office',
  H8_GIRLS_ISLAMABAD: 'Inter - Company A/c H-8 Girls - Islamabad',
  G10_PRE_JUNIOR_ISLAMABAD: 'Inter - Company A/c G-10 Pre-junior - Islamabad',
  F11_PRE_JUNIOR_ISLAMABAD: 'Inter - Company A/c F-11 Pre-junior - Islamabad',
  CHAKSHAHZAD_BOYS: 'Inter - Company A/c Chakshahzad Boys',
  TOWN_BRANCH_PESHAWAR: 'Inter - Company A/c Town Branch - Peshawar',
  SATELLITE_TOWN_RAWALPINDI: 'Inter - Company A/c Satellite Town - Rawalpindi',
  HAYATABAD_PESHAWAR: 'Inter - Company A/c Hayatabad - Peshawar',
  LAHORE_BOYS_JUNIOR: 'Inter - Company A/c Lahore Boys & Junior',
  LAHORE_GIRLS: 'Inter - Company A/c Lahore Girls',
  ISLAMPURA_LAHORE: 'Inter - Company A/c Islampura - Lahore',
  KHAYABAN_E_AMEEN: 'Inter - Company A/c Khayaban E Ameen',
  DREAM_GARDEN: 'Inter - Company A/c Dream Garden - Lahore',
  ALI_CHOWK_MULTAN: 'Inter - Company A/c Ali Chowk - Multan',
  SHALIMAR_MULTAN: 'Inter - Company A/c Shalimar - Multan',
  QUETTA_BOYS: 'Inter - Company A/c Quetta Boys',
  QUETTA_GIRLS: 'Inter - Company A/c Quetta Girls',
  QUETTA_JINNAH_TOWN: 'Inter - Company A/c Quetta Jinnah Town',
  JAMSHORO: 'Inter - Company A/c Jamshoro',
  HYDERABAD: 'Inter - Company A/c Hyderabad',
  GULISTAN_E_JOHAR_BOYS: 'Inter - Company A/c Gulistan E Johar Boys',
  GULSHAN_E_IQBAL_GIRLS: 'Inter - Company A/c Gulshan E Iqbal Girls',
  CLIFTON_BOYS_KARACHI: 'Inter - Company A/c Clifton Boys - Karachi',
  KHAIRPUR: 'Inter - Company A/c Khairpur',
  MULTAN_MODEL_TOWN: 'Inter - Company A/c Multan Model Town',
};

const CAMPUS_CODES = SAMPLE_COMPANIES.map(c => c.code).filter(c => c !== HO_CODE);

const PARENT_INTERCO = '21300000';

const now = new Date().toISOString();

// ---------- Chart of Accounts ----------
function buildCoA(): ChartOfAccount[] {
  const rows: ChartOfAccount[] = [];

  // Parent intercompany account (one per company)
  for (const co of SAMPLE_COMPANIES) {
    rows.push({
      Company: co.code, AcctCode: PARENT_INTERCO, AcctName: 'Inter Company',
      GroupMask: 'L', FatherNum: '21000000', Levels: 2, Postable: false, CreatedDate: now,
    });

    // Child intercompany accounts: one for each counterpart campus + HO
    let line = 0;
    for (const counterpart of [HO_CODE, ...CAMPUS_CODES]) {
      if (counterpart === co.code) continue;
      line += 1;
      rows.push({
        Company: co.code,
        AcctCode: `2130${String(line).padStart(4, '0')}`,
        AcctName: CAMPUS_COA_NAMES[counterpart] ?? `Inter - Company A/c ${counterpart}`,
        GroupMask: 'L',
        FatherNum: PARENT_INTERCO,
        Levels: 3,
        Postable: true,
        CreatedDate: now,
      });
    }

    // A few non-intercompany decoy accounts
    rows.push({ Company: co.code, AcctCode: '11010000', AcctName: 'Cash in Hand',          GroupMask: 'A', FatherNum: '11000000', Levels: 3, Postable: true,  CreatedDate: now });
    rows.push({ Company: co.code, AcctCode: '11020000', AcctName: 'Bank — Operating',      GroupMask: 'A', FatherNum: '11000000', Levels: 3, Postable: true,  CreatedDate: now });
    rows.push({ Company: co.code, AcctCode: '41010000', AcctName: 'Tuition Fee Income',    GroupMask: 'I', FatherNum: '41000000', Levels: 3, Postable: true,  CreatedDate: now });
    rows.push({ Company: co.code, AcctCode: '51010000', AcctName: 'Salaries & Wages',      GroupMask: 'E', FatherNum: '51000000', Levels: 3, Postable: true,  CreatedDate: now });
  }

  return rows;
}

export const SAMPLE_CHART_OF_ACCOUNTS: ChartOfAccount[] = buildCoA();

/** Look up the intercompany account in `companyOf` that points at `counterpart`. */
function findIntercoAccount(companyOf: string, counterpart: string): ChartOfAccount | null {
  const wanted = CAMPUS_COA_NAMES[counterpart];
  if (!wanted) return null;
  return SAMPLE_CHART_OF_ACCOUNTS.find(a => a.Company === companyOf && a.AcctName === wanted) ?? null;
}

// ---------- Deterministic RNG ----------
function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SHORT_NAMES = ['HBL Bank', 'MCB Bank', 'Vendor Pay', 'HO Reimburse', 'Salary Adv', 'Capex Fund', 'Books & Stationery', 'Utility Pmt', 'Cleaning Svc', 'Lab Equipment'];
const MEMOS = [
  'HO transfer for monthly operations',
  'Reimbursement for vendor payment',
  'Salary advance funding',
  'Capex purchase reimbursement',
  'Utility bill settlement',
  'Inter-company adjustment',
  'Books and stationery — funding',
  'Cleaning contract settlement',
];

// ---------- General Ledger ----------
function buildGL(): GeneralLedgerRow[] {
  const rows: GeneralLedgerRow[] = [];
  const months = [
    '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04',
  ];

  let txCounter = 100000;
  let lineCounter = 1;

  for (const month of months) {
    let monthSeed = 0;
    for (let i = 0; i < month.length; i++) monthSeed = (monthSeed * 31 + month.charCodeAt(i)) | 0;
    const rand = mulberry32(monthSeed);

    for (const campus of CAMPUS_CODES) {
      // 5–9 mirror pairs per campus per month
      const pairs = 5 + Math.floor(rand() * 5);

      for (let p = 0; p < pairs; p++) {
        const day = 1 + Math.floor(rand() * 27);
        const date = `${month}-${String(day).padStart(2, '0')}`;
        const amount = Math.round((5000 + rand() * 250000) / 100) * 100;
        const direction = rand() > 0.5 ? 'ho_to_campus' : 'campus_to_ho';
        const memo = MEMOS[Math.floor(rand() * MEMOS.length)];
        const shortName = SHORT_NAMES[Math.floor(rand() * SHORT_NAMES.length)];
        const trans = `T${txCounter++}`;
        const je = `JE-${month.replace('-', '')}-${String(p + 1).padStart(4, '0')}`;

        const hoAcct = findIntercoAccount(HO_CODE, campus);
        const campusAcct = findIntercoAccount(campus, HO_CODE);
        if (!hoAcct || !campusAcct) continue;

        // Decide reconciliation accuracy per pair
        const accuracy = rand();
        let campusAmount = amount;
        let skipCampus = false;
        let skipHO = false;
        if (accuracy < 0.08) skipCampus = true;        // unmatched HO
        else if (accuracy < 0.14) skipHO = true;       // unmatched Campus
        else if (accuracy < 0.25) campusAmount = amount - Math.round((50 + rand() * 4000)); // small difference

        // Mirror effect: if HO Debits campus account, campus Credits HO account
        const hoDebit = direction === 'ho_to_campus' ? amount : 0;
        const hoCredit = direction === 'ho_to_campus' ? 0 : amount;
        const campusDebit = direction === 'ho_to_campus' ? 0 : campusAmount;
        const campusCredit = direction === 'ho_to_campus' ? campusAmount : 0;

        if (!skipHO) {
          rows.push({
            id: `gl-${rows.length + 1}`,
            Company: HO_CODE,
            PostingDate: date,
            TransId: trans,
            JournalEntryNo: je,
            JE_Memo: memo,
            LineID: lineCounter++,
            AccountCode: hoAcct.AcctCode,
            Debit: hoDebit,
            Credit: hoCredit,
            Net: hoDebit - hoCredit,
            ShortName: shortName,
          });
        }
        if (!skipCampus) {
          // Slight date drift on the campus side (1-2 days)
          const dayDrift = Math.floor(rand() * 3);
          const driftDate = `${month}-${String(Math.min(28, day + dayDrift)).padStart(2, '0')}`;
          rows.push({
            id: `gl-${rows.length + 1}`,
            Company: campus,
            PostingDate: driftDate,
            TransId: trans,             // same TransId for true matches
            JournalEntryNo: je,
            JE_Memo: memo,
            LineID: lineCounter++,
            AccountCode: campusAcct.AcctCode,
            Debit: campusDebit,
            Credit: campusCredit,
            Net: campusDebit - campusCredit,
            ShortName: shortName,
          });
        }
      }
    }
  }

  return rows;
}

export const SAMPLE_GENERAL_LEDGER: GeneralLedgerRow[] = buildGL();
