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
  calendarYear: number;
  calendarYearLabel: string;
  yearOfTen: string;
  decadeProgressPct: number;
  tagline: string;
  headline: string;
  detail: string;
  notableChange: string;
  topField: string;
  accentColor: string;
}

export const SALARY_STORY_BEATS: Record<number, SalaryYearStory> = {
  1: {
    year: 1,
    label: 'Year 1',
    calendarYear: 2016,
    calendarYearLabel: '2016 (Year 1)',
    yearOfTen: 'Year 1 of 10 • 2016 (Career Entry)',
    decadeProgressPct: 10,
    tagline: 'Initial Graduate Entry & Public Sector Scales',
    headline: 'Public Sector Entry Bands Lead Starting Salaries',
    detail: 'Education (€36,192) and Health & Welfare (€34,424) enter with the highest starting medians due to standardized public pay scales. Tech begins at #3 (€31,460).',
    notableChange: 'Education & Health lead; Tech starts at #3',
    topField: 'Education (€36,192/yr)',
    accentColor: '#38bdf8',
  },
  2: {
    year: 2,
    label: 'Year 2',
    calendarYear: 2017,
    calendarYearLabel: '2017 (Year 2)',
    yearOfTen: 'Year 2 of 10 • 2017 (Corporate Shift)',
    decadeProgressPct: 20,
    tagline: 'First Corporate Step & Trajectory Adjustments',
    headline: 'Education Holds Top Spot; Private STEM Accelerates',
    detail: 'Education (€37,700) and Health (€36,660) maintain top 2. ICT jumps to €35,880 (+14%), rapidly closing the distance to #1.',
    notableChange: 'ICT narrows gap to #1; Social Sciences overtakes Services',
    topField: 'Education (€37,700/yr)',
    accentColor: '#818cf8',
  },
  3: {
    year: 3,
    label: 'Year 3',
    calendarYear: 2018,
    calendarYearLabel: '2018 (Year 3)',
    yearOfTen: 'Year 3 of 10 • 2018 (The Tech Crossover)',
    decadeProgressPct: 30,
    tagline: 'The Crossover Milestone',
    headline: 'ICT Surges to #1 Overtaking Education & Health',
    detail: 'Information & Communications Tech reaches €40,300/yr (+28% since Y1), seizing 1st place. Business climbs past Agriculture.',
    notableChange: 'ICT leaps from #3 to #1 (+2 rank swap); Business climbs',
    topField: 'ICT (€40,300/yr)',
    accentColor: '#06b6d4',
  },
  5: {
    year: 5,
    label: 'Year 5',
    calendarYear: 2020,
    calendarYearLabel: '2020 (Year 5)',
    yearOfTen: 'Year 5 of 10 • 2020 (Mid-Career Consolidation)',
    decadeProgressPct: 50,
    tagline: 'Mid-Career Compounding Surge',
    headline: 'Engineering Claims #2; STEM Takes Top Two Spots',
    detail: 'Engineering & Construction overtakes both Health and Education into 2nd place (€45,032/yr). ICT widens its #1 lead to €49,244/yr.',
    notableChange: 'Engineering surges +2 spots into #2; STEM dominates top 2',
    topField: 'ICT (€49,244/yr)',
    accentColor: '#10b981',
  },
  8: {
    year: 8,
    label: 'Year 8',
    calendarYear: 2023,
    calendarYearLabel: '2023 (Year 8)',
    yearOfTen: 'Year 8 of 10 • 2023 (Private Compounding)',
    decadeProgressPct: 80,
    tagline: 'Private Sector Compounding Pulls Ahead',
    headline: 'Business & Natural Sciences Push Past Public Scales',
    detail: 'Natural Sciences (€52,312) and Business (€52,104) both climb +2 spots into #3 and #4, pushing Education and Health down to #5 and #6.',
    notableChange: 'Natural Sciences & Business jump into top 4; Health falls -3',
    topField: 'ICT (€61,984/yr)',
    accentColor: '#a855f7',
  },
  10: {
    year: 10,
    label: 'Year 10',
    calendarYear: 2025,
    calendarYearLabel: '2025 (Year 10)',
    yearOfTen: 'Year 10 of 10 • 2025 (Full Decade Horizon)',
    decadeProgressPct: 100,
    tagline: 'The Decade Horizon',
    headline: 'ICT Crosses €70,000; Business Joins Top 3',
    detail: 'ICT median hits €70,200/yr (+123% since Y1). Business & Law enters top 3 (€58,552, +137% growth). The initial #1 (Education) now sits at #5.',
    notableChange: 'ICT reaches €70.2k; Business enters top 3; Initial #1 drops to #5',
    topField: 'ICT (€70,200/yr)',
    accentColor: '#f59e0b',
  },
};

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
