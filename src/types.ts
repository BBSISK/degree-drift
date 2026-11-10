export interface FlowItem {
  sourceId: string;
  sourceName: string;
  targetId: string;
  targetName: string;
  count: number;
  percentOfField: number;
  percentOfSector: number;
}

export interface FieldEarnings {
  fieldId: string;
  fieldName: string;
  weeklyMedianEur: number;
  annualEquivalentEur: number;
}

export interface TimelineData {
  yearsSinceGraduation: number;
  flows: FlowItem[];
  fieldTotals: Record<string, number>;
  sectorTotals: Record<string, number>;
  earnings: Record<string, FieldEarnings>;
}

export interface Dataset {
  metadata: {
    source: string;
    tables: string[];
    url: string;
    description: string;
    nfq_levels: Record<string, string>;
    fields: Record<string, string>;
    sectors: Record<string, string>;
    institutions: Record<string, string>;
  };
  timelines: {
    all: Record<string, TimelineData>;
    level_8: Record<string, TimelineData>;
    level_9: Record<string, TimelineData>;
  };
  institutionEarnings: Record<string, Record<NfqKey, Record<string, Record<string, FieldEarnings>>>>;
}

export type NfqKey = 'all' | 'level_8' | 'level_9';
