import { PatientStatuses, PatientIsolationFilterNames, PatientOverviewStatusesFilters, Virus } from '@enums';
import { AutocompleteAsyncOptionType } from '@components/autocompletes';

export interface ClientOverviewPatient {
  id: string;
  name: {
    id: string;
    name: string;
    photoPath?: string;
  };
  document: string;
  gender: string;
  isolation: Virus[];
  hdSchedule: string;
  treatments: string;
  access: string;
  status: PatientStatuses;
  idwg?: number;
}

export interface ClientOverviewPatientTable {
  content: ClientOverviewPatient[];
  totalElements: number;
  totalPages: number;
  size: number;
  first: boolean;
  last: boolean;
}

export type PatientIsolationFilterItem = {
  name: PatientIsolationFilterNames;
  checked: boolean;
};

export type PatientOverviewStatusesFilterItem = {
  name: PatientOverviewStatusesFilters;
  badge: string;
  selected: boolean;
};

export type PatientsOverviewFilters = {
  patient?: AutocompleteAsyncOptionType | null;
  isolation: {
    items: PatientIsolationFilterItem[];
  };
  statuses: {
    items: PatientOverviewStatusesFilterItem[];
  };
};

export type ChangePatientsOverviewFiltersPayload = {
  patient?: AutocompleteAsyncOptionType | null;
  isolations?: {
    items: PatientIsolationFilterItem[];
  };
};

export type ChangePatientsOverviewStatusesFiltersPayload = {
  items: PatientOverviewStatusesFilterItem[];
};
