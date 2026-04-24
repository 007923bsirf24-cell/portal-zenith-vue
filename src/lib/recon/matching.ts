import { GeneralLedgerRow, MatchStatus, ReconciledLine } from './types';

export interface MatchSuggestion {
  hoRow: GeneralLedgerRow;
  campusRow: GeneralLedgerRow;
  status: MatchStatus;       // 'exact' | 'suggested' | 'possible'
  score: number;             // 0..100
  difference: number;
  reasons: string[];
}

const monthOf = (iso: string) => iso.slice(0, 7);
const daysBetween = (a: string, b: string) =>
  Math.abs(Math.round((new Date(a).getTime() - new Date(b).getTime()) / 86400000));

/**
 * Mirror-effect pairing:
 *   HO Debit  ↔ Campus Credit  (HO net positive ↔ Campus net negative)
 *   HO Credit ↔ Campus Debit
 * We pair on opposite Net signs.
 */
function isMirror(a: GeneralLedgerRow, b: GeneralLedgerRow): boolean {
  if (a.Net === 0 && b.Net === 0) return false;
  return Math.sign(a.Net) !== Math.sign(b.Net);
}

export function buildSuggestions(
  hoRows: GeneralLedgerRow[],
  campusRows: GeneralLedgerRow[],
  excludeIds: Set<string>,
): MatchSuggestion[] {
  const used = new Set<string>();
  const out: MatchSuggestion[] = [];

  // Greedy: walk HO rows by date, pick the best campus candidate
  const hos = [...hoRows]
    .filter(r => !excludeIds.has(r.id))
    .sort((a, b) => a.PostingDate.localeCompare(b.PostingDate));
  const camps = campusRows.filter(r => !excludeIds.has(r.id));

  for (const ho of hos) {
    let best: { row: GeneralLedgerRow; score: number; reasons: string[]; diff: number } | null = null;

    for (const c of camps) {
      if (used.has(c.id)) continue;
      if (!isMirror(ho, c)) continue;
      if (monthOf(ho.PostingDate) !== monthOf(c.PostingDate)) continue;

      const reasons: string[] = [];
      let score = 0;

      const hoAbs = Math.abs(ho.Net);
      const cAbs = Math.abs(c.Net);
      const diff = Math.abs(hoAbs - cAbs);

      if (diff === 0) { score += 60; reasons.push('Exact amount'); }
      else if (diff <= Math.max(50, hoAbs * 0.01)) { score += 45; reasons.push(`Amount diff ${diff.toLocaleString()}`); }
      else if (diff <= hoAbs * 0.05) { score += 25; reasons.push(`Approx amount (Δ ${diff.toLocaleString()})`); }
      else continue; // >5% off → skip

      if (ho.TransId && c.TransId && ho.TransId === c.TransId) { score += 25; reasons.push('Same TransId'); }
      if (ho.JournalEntryNo && c.JournalEntryNo && ho.JournalEntryNo === c.JournalEntryNo) {
        score += 15; reasons.push('Same JE No');
      }
      if (ho.ShortName && c.ShortName && ho.ShortName === c.ShortName) { score += 5; reasons.push('Same ShortName'); }
      if (ho.JE_Memo && c.JE_Memo && ho.JE_Memo === c.JE_Memo) { score += 5; reasons.push('Same memo'); }

      const dd = daysBetween(ho.PostingDate, c.PostingDate);
      if (dd === 0) score += 10;
      else if (dd <= 3) score += 6;
      else if (dd <= 7) score += 2;
      else score -= 5;

      if (!best || score > best.score) {
        best = { row: c, score, reasons, diff };
      }
    }

    if (best && best.score >= 30) {
      const status: MatchStatus =
        best.diff === 0 && best.score >= 80 ? 'exact'
          : best.score >= 60 ? 'suggested'
            : 'possible';
      out.push({
        hoRow: ho,
        campusRow: best.row,
        status,
        score: Math.min(100, best.score),
        difference: best.diff,
        reasons: best.reasons,
      });
      used.add(best.row.id);
    }
  }

  return out;
}

/** Helper for the workspace's "tick this pair" action. */
export function classifyManual(
  ho: GeneralLedgerRow,
  campus: GeneralLedgerRow,
): { status: 'exact' | 'difference'; difference: number; matched: number } {
  if (!isMirror(ho, campus)) {
    return { status: 'difference', difference: Math.abs(ho.Net) + Math.abs(campus.Net), matched: 0 };
  }
  const hoAbs = Math.abs(ho.Net);
  const cAbs = Math.abs(campus.Net);
  const diff = Math.abs(hoAbs - cAbs);
  const matched = Math.min(hoAbs, cAbs);
  return { status: diff === 0 ? 'exact' : 'difference', difference: diff, matched };
}

export function summarizeReconciled(lines: ReconciledLine[]) {
  return lines.reduce(
    (acc, l) => {
      acc.matched += l.amountMatched;
      acc.difference += l.differenceAmount;
      acc.count += 1;
      return acc;
    },
    { matched: 0, difference: 0, count: 0 },
  );
}
