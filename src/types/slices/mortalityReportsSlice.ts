import { MortalityReportFilters, MortalityReportFiltersError, ReportsState } from '@types';
import { PatientStatuses } from '@enums';

export type MortalityReportsContentItem = {
  id: number;
  patient: {
    id: number;
    name: string;
  };
  deathDate: string;
  comment: string;
  previousStatus: PatientStatuses;
};

export type MortalityReportsSliceState = {
  reports: {
    content: MortalityReportsContentItem[];
    filters: MortalityReportFilters;
    filtersError: MortalityReportFiltersError;
  };
} & ReportsState;
