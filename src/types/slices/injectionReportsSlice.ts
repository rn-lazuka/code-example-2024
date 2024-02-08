import {
  InjectionEntity,
  InjectionReportFilters,
  InjectionReportFiltersError,
  PatientWithDocument,
  ReportsState,
} from '@types';

export type InjectionReportsContentItem = {
  id: number;
  patient: PatientWithDocument;
  administeredAt: string;
  injection: InjectionEntity;
  shiftName: string;
};

export type InjectionReportsSliceState = {
  reports: {
    content: InjectionReportsContentItem[];
    filters: InjectionReportFilters;
    filtersError: InjectionReportFiltersError;
  };
} & ReportsState;
