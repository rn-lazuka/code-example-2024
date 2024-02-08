import type { PatientIsolationFilterItem, Pagination } from '@types';
import {
  PatientStatuses,
  DialysisStatus,
  AppointmentsStatusesFilters,
  SpecialNote,
  Virus,
  AppointmentStatus,
} from '@enums';

export interface Appointment {
  id: number;
  dialysisId: number;
  patientId: number;
  patientName: string;
  photoPath: string;
  bay: string;
  startTime: string;
  endTime: string;
  isolation: Virus[];
}

export type AppointmentTableItem = Omit<Appointment, 'patientName' | 'patientId' | 'photoPath'> & {
  name: {
    id: number;
    name: string;
    photoPath: string;
  };
  hdProgress: {
    patientId: number;
    appointmentId: number;
  };
  status: DialysisStatus;
  patientStatus: PatientStatuses;
  tags: SpecialNote[];
};

export interface AppointmentsTable {
  content: AppointmentTableItem[];
  pagination: Pagination;
}

export type AppointmentsStatusesFilterItem = {
  name: AppointmentsStatusesFilters;
  badge: string;
  selected: boolean;
};

export type TodayPatientsPatientFilterType = { name: string; id: string } | null;

export type TodayPatientFilters = {
  patient: TodayPatientsPatientFilterType;
  isolation: {
    items: PatientIsolationFilterItem[];
  };
  statuses: {
    items: AppointmentsStatusesFilterItem[];
  };
};

export interface AppointmentsContentResponse {
  id: number;
  patientId: number;
  dialysisId: number;
  patientName: string;
  bay: string;
  startTime: Date;
  endTime: Date;
  isolation: {
    hbsag: string;
    antiHcv: string;
    antiHiv: string;
  };
  duration: number;
  photoPath: string;
  status: DialysisStatus | AppointmentStatus;
  patientStatus: PatientStatuses;
  specialNotes: SpecialNote[];
  idwg?: number;
}

export interface AppointmentsResponse {
  totalElements: number;
  totalPages: number;
  size: number;
  content: AppointmentsContentResponse[];
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  pageable: {
    offset: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
    paged: boolean;
  };
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export type AppointmentsStatusesFilterCountersResponse = {
  waitList: number;
  inProgress: number;
  completed: number;
  cancelled: number;
};
