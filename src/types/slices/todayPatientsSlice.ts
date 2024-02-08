import type { AppointmentTableItem, TodayPatientFilters, Pagination, PatientPlannedInjection, Shift } from '@types';
import { TodayPatientsTabs, TodayPatientsViewMode } from '@enums';

export type TodayPatientsSliceState = {
  injectionsLoading: boolean;
  loading: boolean;
  error: any;
  appointments: AppointmentTableItem[];
  injections: PatientPlannedInjection[];
  pagination: Pagination;
  filterDate: Date;
  filters: TodayPatientFilters;
  shifts: Shift[];
  activeTab: TodayPatientsTabs;
  viewMode: TodayPatientsViewMode;
};
