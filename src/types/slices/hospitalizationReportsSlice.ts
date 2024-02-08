import {
  ReportsState,
  HospitalizationResponseContentItem,
  HospitalizationReportFilters,
  HospitalizationReportFiltersErrors,
} from '@types';

export type HospitalizationReportsSliceState = {
  reports: {
    content: HospitalizationResponseContentItem[];
    filters: HospitalizationReportFilters;
    filtersErrors: HospitalizationReportFiltersErrors;
  };
} & ReportsState;
