import { ChartOfAccount, IntercompanyMapping } from './types';

/** Heuristic: detect intercompany accounts by name + parent-account convention. */
export function isIntercompanyAccount(coa: ChartOfAccount): boolean {
  const n = (coa.AcctName || '').toLowerCase();
  if (n.includes('inter company')) return true;
  if (n.includes('inter - company')) return true;
  if (n.includes('inter-company')) return true;
  if (n.includes('intercompany')) return true;
  // Conventional parent: 21300000 is our intercompany parent in the seed data
  if (coa.FatherNum === '21300000') return true;
  return false;
}

/**
 * Try to derive which counterpart company an intercompany CoA row points at,
 * by matching keywords in the account name.
 */
export function inferLinkedCompany(
  coa: ChartOfAccount,
  companyCodes: string[],
): string | null {
  const n = (coa.AcctName || '').toLowerCase();
  if (n.includes('head office')) return 'TMF_HO_OB';

  const candidates: { code: string; score: number }[] = [];
  for (const code of companyCodes) {
    const tokens = code.toLowerCase().replace(/_/g, ' ').split(/\s+/).filter(Boolean);
    let score = 0;
    for (const t of tokens) {
      if (t.length < 3) continue;
      if (n.includes(t)) score += 1;
    }
    if (score > 0) candidates.push({ code, score });
  }
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.code ?? null;
}

/** Build initial mappings from CoA + the manual overrides the user has saved. */
export function buildMappings(
  coa: ChartOfAccount[],
  companyCodes: string[],
  manualOverrides: Record<string, Partial<IntercompanyMapping>> = {},
): IntercompanyMapping[] {
  const out: IntercompanyMapping[] = [];

  for (const a of coa) {
    const key = `${a.Company}::${a.AcctCode}`;
    const override = manualOverrides[key];
    const detected = isIntercompanyAccount(a);
    if (!detected && !override?.manualOverride) continue;

    const linked = override?.linkedCompany ?? inferLinkedCompany(a, companyCodes);
    const accountType: IntercompanyMapping['accountType'] =
      override?.accountType ??
      (a.Company === 'TMF_HO_OB' ? 'head_office' : 'campus');

    out.push({
      id: key,
      company: a.Company,
      acctCode: a.AcctCode,
      acctName: a.AcctName,
      fatherNum: a.FatherNum,
      levels: a.Levels,
      postable: a.Postable,
      linkedCompany: linked,
      accountType,
      active: override?.active ?? true,
      manualOverride: override?.manualOverride ?? false,
      updatedAt: new Date().toISOString(),
    });
  }

  // Include any manual-only overrides that point at accounts not detected by heuristics
  for (const [key, override] of Object.entries(manualOverrides)) {
    if (!override.manualOverride) continue;
    if (out.find(m => m.id === key)) continue;
    const [company, acctCode] = key.split('::');
    const a = coa.find(x => x.Company === company && x.AcctCode === acctCode);
    if (!a) continue;
    out.push({
      id: key,
      company: a.Company,
      acctCode: a.AcctCode,
      acctName: a.AcctName,
      fatherNum: a.FatherNum,
      levels: a.Levels,
      postable: a.Postable,
      linkedCompany: override.linkedCompany ?? null,
      accountType: override.accountType ?? 'other',
      active: override.active ?? true,
      manualOverride: true,
      updatedAt: new Date().toISOString(),
    });
  }

  return out;
}
