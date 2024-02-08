import type { Pagination, PatientCensusFilters, PatientCensusFiltersError, PatientCensusReportContent } from '@types';

export type PatientCensusReportSliceState = {
  loading: boolean;
  error: string | null;
  couldGenerateReport: boolean;
  reports: {
    content: PatientCensusReportContent[];
    filters: PatientCensusFilters;
    filtersError: PatientCensusFiltersError;
  };
  pagination: Pagination;
};
