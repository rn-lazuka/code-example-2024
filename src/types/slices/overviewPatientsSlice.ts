import { ClientOverviewPatient, PatientsOverviewFilters, Pagination } from '@types';

export interface OverviewSliceState {
  loading: boolean;
  error: string | null;
  patients: ClientOverviewPatient[];
  filters: PatientsOverviewFilters;
  pagination: Pagination;
}
