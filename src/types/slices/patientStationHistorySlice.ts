import {
  PatientStationHistoryFilters,
  PatientStationHistoryFiltersError,
  PatientStationHistoryReportContentItem,
  ReportsState,
} from '@types';

export type patientStationHistoryState = {
  reports: {
    content: PatientStationHistoryReportContentItem[];
    filters: PatientStationHistoryFilters;
    filtersError: PatientStationHistoryFiltersError;
  };
} & ReportsState;
