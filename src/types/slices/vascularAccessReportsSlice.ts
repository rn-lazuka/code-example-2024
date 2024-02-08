import type {
  VascularAccessReportsTableItem,
  VascularAccessFilters,
  VascularAccessFiltersErrors,
  ReportsState,
} from '@types';

export type VascularAccessReportsSliceState = {
  reports: {
    content: VascularAccessReportsTableItem[];
    filters: VascularAccessFilters;
    filtersError: VascularAccessFiltersErrors;
  };
} & ReportsState;
