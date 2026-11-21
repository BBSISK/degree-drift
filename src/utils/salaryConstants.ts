import { FieldEarnings } from '../types';

export interface FieldVisualConfig {
  id: string;
  name: string;
  shortName: string;
  color: string;
  gradient: string;
  glowColor: string;
  badgeBg: string;
  badgeText: string;
  borderAccent: string;
}

export const FIELD_CONFIGS: Record<string, FieldVisualConfig> = {
  '06': {
    id: '06',
    name: 'Information & Comm. Tech (ICT)',
    shortName: 'ICT / Tech',
    color: '#06b6d4',
    gradient: 'from-cyan-500 via-sky-500 to-blue-600',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    badgeBg: 'bg-cyan-500/15',
    badgeText: 'text-cyan-300',
    borderAccent: 'border-cyan-500/30',
  },
  '07': {
    id: '07',
    name: 'Engineering & Construction',
    shortName: 'Engineering & Constr.',
    color: '#f97316',
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    glowColor: 'rgba(249, 115, 22, 0.45)',
    badgeBg: 'bg-orange-500/15',
    badgeText: 'text-orange-300',
    borderAccent: 'border-orange-500/30',
  },
  '04': {
    id: '04',
    name: 'Business, Admin & Law',
    shortName: 'Business, Admin & Law',
    color: '#3b82f6',
    gradient: 'from-blue-500 via-indigo-500 to-violet-600',
    glowColor: 'rgba(59, 130, 246, 0.45)',
    badgeBg: 'bg-blue-500/15',
    badgeText: 'text-blue-300',
    borderAccent: 'border-blue-500/30',
  },
  '05': {
    id: '05',
    name: 'Natural Sciences & Mathematics',
    shortName: 'Natural Sciences & Math',
    color: '#10b981',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-300',
    borderAccent: 'border-emerald-500/30',
  },
  '01': {
    id: '01',
    name: 'Education',
    shortName: 'Education',
    color: '#f59e0b',
    gradient: 'from-amber-400 via-yellow-500 to-amber-600',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-300',
    borderAccent: 'border-amber-500/30',
  },
  '09': {
    id: '09',
    name: 'Health & Welfare',
    shortName: 'Health & Welfare',
    color: '#e11d48',
    gradient: 'from-rose-500 via-red-500 to-rose-700',
    glowColor: 'rgba(225, 29, 72, 0.45)',
    badgeBg: 'bg-rose-500/15',
    badgeText: 'text-rose-300',
    borderAccent: 'border-rose-500/30',
  },
  '03': {
    id: '03',
    name: 'Social Sciences & Journalism',
    shortName: 'Social Sciences',
    color: '#a855f7',
    gradient: 'from-purple-500 via-fuchsia-500 to-indigo-600',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    badgeBg: 'bg-purple-500/15',
    badgeText: 'text-purple-300',
    borderAccent: 'border-purple-500/30',
  },
  '08': {
    id: '08',
    name: 'Agriculture & Veterinary',
    shortName: 'Agriculture & Vet',
    color: '#84cc16',
    gradient: 'from-lime-500 via-emerald-500 to-green-600',
    glowColor: 'rgba(132, 204, 22, 0.45)',
    badgeBg: 'bg-lime-500/15',
    badgeText: 'text-lime-300',
    borderAccent: 'border-lime-500/30',
  },
  '02': {
    id: '02',
    name: 'Arts & Humanities',
    shortName: 'Arts & Humanities',
    color: '#ec4899',
    gradient: 'from-pink-500 via-rose-400 to-pink-600',
    glowColor: 'rgba(236, 72, 153, 0.45)',
    badgeBg: 'bg-pink-500/15',
    badgeText: 'text-pink-300',
    borderAccent: 'border-pink-500/30',
  },
  '10': {
    id: '10',
    name: 'Services',
    shortName: 'Services',
    color: '#64748b',
    gradient: 'from-slate-400 via-slate-500 to-slate-600',
    glowColor: 'rgba(100, 116, 139, 0.45)',
    badgeBg: 'bg-slate-500/15',
    badgeText: 'text-slate-300',
    borderAccent: 'border-slate-500/30',
  },
};

export interface SalaryYearStory {
  year: number;
  label: string;
  /** Graduating cohorts the CSO has published for this horizon (pooled). */
  cohortLabel: string;
  yearOfTen: string;
  decadeProgressPct: number;
  tagline: string;
  headline: string;
  detail: string;
  notableChange: string;
  topField: string;
  accentColor: string;
}

/**
 * Graduating cohorts pooled at each "years since graduation" horizon.
 * Matches metadata.cohortsByYearsSince in public/data.json (CSO HEO12/HEO16,
 * latest earnings year 2023). Year 1 and Year 10 are different graduates.
 */
export const COHORT_LABELS: Record<number, string> = {
  1: '2010–22 grads',
  2: '2010–21 grads',
  3: '2010–20 grads',
  5: '2010–18 grads',
  8: '2010–15 grads',
  10: '2010–13 grads',
};

export const STORY_SCOPE_LABEL = 'National • NFQ Level 8';

export const POOLING_NOTE =
  'Each year pools every graduating cohort the CSO has published for that horizon, so Year 1 and Year 10 are not the same graduates. Earnings: average of cohort median weekly pay × 52, nominal €.';

const ACCENTS: Record<number, string> = {
  1: '#38bdf8',
  2: '#818cf8',
  3: '#06b6d4',
  5: '#10b981',
  8: '#a855f7',
  10: '#f59e0b',
};

/**
 * Curated narrative for the NATIONAL, NFQ LEVEL 8 view only.
 * Every figure below is taken from public/data.json (timelines.level_8.<year>.earnings).
 */
export const SALARY_STORY_BEATS: Record<number, SalaryYearStory> = {
  1: {
    year: 1,
    label: 'Year 1',
    cohortLabel: COHORT_LABELS[1],
    yearOfTen: 'Year 1 of 10 • Career entry',
    decadeProgressPct: 10,
    tagline: 'Graduate entry',
    headline: 'Education and Health Lead at Year 1',
    detail: 'Education (€36,192) and Health & Welfare (€34,424) have the highest Year 1 medians, in line with public-sector pay scales. ICT starts at #3 (€31,460).',
    notableChange: 'Education & Health lead; ICT starts at #3',
    topField: 'Education (€36,192/yr)',
    accentColor: ACCENTS[1],
  },
  2: {
    year: 2,
    label: 'Year 2',
    cohortLabel: COHORT_LABELS[2],
    yearOfTen: 'Year 2 of 10',
    decadeProgressPct: 20,
    tagline: 'Early career',
    headline: 'Education Holds #1; ICT Closes In',
    detail: 'Education (€37,700) and Health (€36,660) stay top 2. ICT rises to €35,880 (+14% on Year 1).',
    notableChange: 'ICT narrows the gap to #1; Social Sciences passes Services',
    topField: 'Education (€37,700/yr)',
    accentColor: ACCENTS[2],
  },
  3: {
    year: 3,
    label: 'Year 3',
    cohortLabel: COHORT_LABELS[3],
    yearOfTen: 'Year 3 of 10',
    decadeProgressPct: 30,
    tagline: 'The crossover',
    headline: 'ICT Moves to #1, Past Education and Health',
    detail: 'ICT reaches €40,300/yr (+28% on Year 1) and takes 1st place. Business moves past Agriculture.',
    notableChange: 'ICT climbs from #3 to #1; Business climbs',
    topField: 'ICT (€40,300/yr)',
    accentColor: ACCENTS[3],
  },
  5: {
    year: 5,
    label: 'Year 5',
    cohortLabel: COHORT_LABELS[5],
    yearOfTen: 'Year 5 of 10',
    decadeProgressPct: 50,
    tagline: 'Mid-career',
    headline: 'Engineering Takes #2; STEM Holds the Top Two',
    detail: 'Engineering & Construction passes Health and Education into 2nd place (€45,032/yr). ICT leads at €49,244/yr.',
    notableChange: 'Engineering up 2 places to #2',
    topField: 'ICT (€49,244/yr)',
    accentColor: ACCENTS[5],
  },
  8: {
    year: 8,
    label: 'Year 8',
    cohortLabel: COHORT_LABELS[8],
    yearOfTen: 'Year 8 of 10',
    decadeProgressPct: 80,
    tagline: 'Private-sector pay pulls ahead',
    headline: 'Natural Sciences and Business Pass Education and Health',
    detail: 'Natural Sciences (€52,312) and Business (€52,104) each climb 2 places to #3 and #4; Education and Health drop to #5 and #6.',
    notableChange: 'Natural Sciences & Business into top 4; Health down 3',
    topField: 'ICT (€61,984/yr)',
    accentColor: ACCENTS[8],
  },
  10: {
    year: 10,
    label: 'Year 10',
    cohortLabel: COHORT_LABELS[10],
    yearOfTen: 'Year 10 of 10 • 2010–13 graduates only',
    decadeProgressPct: 100,
    tagline: 'Ten years on',
    headline: 'ICT Highest at €70,200; Business Joins Top 3',
    detail: 'ICT is highest at €70,200/yr (+123% on Year 1). Business reaches #3 (€58,552, +137%). Fastest relative growth is Arts & Humanities (+146%). Year 1 leader Education is now #5.',
    notableChange: 'ICT highest; Arts grows fastest; Education #1 → #5',
    topField: 'ICT (€70,200/yr)',
    accentColor: ACCENTS[10],
  },
};

/** True only for the view the curated beats were written for. */
export function isCuratedScope(nfqLabel?: string, institutionName?: string): boolean {
  const lvl8 = !nfqLabel || nfqLabel.startsWith('Level 8');
  const national =
    !institutionName || institutionName.startsWith('National') || institutionName.startsWith('All Institutions');
  return lvl8 && national;
}

/**
 * Returns the curated beat for the national Level 8 view, otherwise a
 * neutral caption computed from the rows actually on screen.
 */
export function getStoryBeat(
  year: number,
  rows: ProcessedSalaryRow[],
  curated: boolean
): SalaryYearStory {
  const base = SALARY_STORY_BEATS[year] || SALARY_STORY_BEATS[1];
  if (curated) return base;
  const top = rows[0];
  const topText = top ? `${top.shortName} (€${top.annualEquivalentEur.toLocaleString()}/yr)` : 'No published figures';
  return {
    ...base,
    tagline: `Year ${year}`,
    headline: top ? `Highest median at Year ${year}: ${top.fieldName}` : `No CSO figures published for Year ${year}`,
    detail: top
      ? `${rows.length} field${rows.length === 1 ? '' : 's'} with published figures. Fields the CSO did not publish for this selection are left out.`
      : 'The CSO has not published earnings for this selection (suppressed or no cohort has reached this year yet).',
    notableChange: top ? `Top: ${topText}` : 'No published figures',
    topField: topText,
  };
}

export interface ProcessedSalaryRow {
  fieldId: string;
  fieldName: string;
  shortName: string;
  annualEquivalentEur: number;
  weeklyMedianEur: number;
  rank: number; // 0-based
  rankDisplay: number; // 1-based
  previousRank: number; // 0-based
  rankShift: number; // previous - current (positive = moved up)
  growthFromY1Pct: number;
  growthFromY1Eur: number;
  barWidthPct: number;
  config: FieldVisualConfig;
}

export function computeRankedSalaryRows(
  currentEarnings: Record<string, FieldEarnings>,
  previousEarnings?: Record<string, FieldEarnings>,
  year1Earnings?: Record<string, FieldEarnings>,
  maxSalaryScale: number = 75000
): ProcessedSalaryRow[] {
  // Sort current earnings descending
  const sortedCurrent = Object.values(currentEarnings)
    .filter((e) => e && e.annualEquivalentEur > 0)
    .sort((a, b) => b.annualEquivalentEur - a.annualEquivalentEur);

  // Map previous ranks
  const prevRankMap = new Map<string, number>();
  if (previousEarnings) {
    const sortedPrev = Object.values(previousEarnings)
      .filter((e) => e && e.annualEquivalentEur > 0)
      .sort((a, b) => b.annualEquivalentEur - a.annualEquivalentEur);
    sortedPrev.forEach((item, idx) => {
      prevRankMap.set(item.fieldId, idx);
    });
  }

  // Map year 1 earnings
  const y1Map = new Map<string, number>();
  if (year1Earnings) {
    Object.values(year1Earnings).forEach((item) => {
      if (item && item.annualEquivalentEur > 0) {
        y1Map.set(item.fieldId, item.annualEquivalentEur);
      }
    });
  }

  return sortedCurrent.map((item, idx) => {
    const config = FIELD_CONFIGS[item.fieldId] || {
      id: item.fieldId,
      name: item.fieldName,
      shortName: item.fieldName,
      color: '#06b6d4',
      gradient: 'from-cyan-500 to-blue-500',
      glowColor: 'rgba(6, 182, 212, 0.4)',
      badgeBg: 'bg-cyan-500/10',
      badgeText: 'text-cyan-400',
      borderAccent: 'border-cyan-500/30',
    };

    const prevRank = prevRankMap.has(item.fieldId) ? prevRankMap.get(item.fieldId)! : idx;
    const rankShift = prevRank - idx; // e.g. prev=2, idx=0 => +2 (climbed 2 ranks)

    const y1Val = y1Map.get(item.fieldId) || item.annualEquivalentEur;
    const growthFromY1Eur = item.annualEquivalentEur - y1Val;
    const growthFromY1Pct = y1Val > 0 ? Math.round((growthFromY1Eur / y1Val) * 100) : 0;

    // Bar width percentage relative to max scale (min 15% for readability)
    const barWidthPct = Math.min(100, Math.max(16, (item.annualEquivalentEur / maxSalaryScale) * 100));

    return {
      fieldId: item.fieldId,
      fieldName: item.fieldName,
      shortName: config.shortName,
      annualEquivalentEur: item.annualEquivalentEur,
      weeklyMedianEur: item.weeklyMedianEur,
      rank: idx,
      rankDisplay: idx + 1,
      previousRank: prevRank,
      rankShift,
      growthFromY1Pct,
      growthFromY1Eur,
      barWidthPct,
      config,
    };
  });
}
