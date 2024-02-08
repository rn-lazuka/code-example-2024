import {
  AppointmentsSchedulesResponse,
  DoctorReviewService,
  IsolationGroupsSummaryResponse,
  LabOrdersService,
  NephrologistVisitEvent,
  PICVisitEvent,
  QuarterlyBloodTestEvent,
  ShiftsResponse,
  ShortServices,
} from '@types';
import { LabOrderStatus, PatientStatuses, DoctorReviewStatus, AppointmentStatus } from '@enums';

export type IsoGroupAvailability = {
  isolationGroupId: string;
  shifts: { id: string; name: string }[];
};
export interface PatientsScheduleSliceState {
  loading: boolean;
  error: string | null;
  scheduleDate: Date;
  shifts: ShiftsResponse;
  isolationsGroup: IsolationGroupsSummaryResponse;
  appointments: AppointmentsSchedulesResponse;
  services: ShortServices | null;
  dayTasks: DayTasks;
  patientActiveHd: any | null;
  currentDayAvailabilityShifts: IsoGroupAvailability[];
}

export interface DayTasks {
  events: DayEvent[];
  appointments: NonHDAppointment[];
}
export interface DayEvent {
  event: QuarterlyBloodTestEvent | PICVisitEvent | NephrologistVisitEvent;
  services: DayEventService[];
}

export interface DayEventService {
  id: string;
  patient: { id: string; name: string; status: PatientStatuses };
  status: LabOrderStatus | DoctorReviewStatus;
  appointmentId: string;
  appointmentStatus: AppointmentStatus;
}

export interface NonHDAppointment {
  date: string;
  id: string;
  patient: {
    id: string;
    name: string;
    patientPhotoPath: string;
  };
  doctorReviews: DoctorReviewService[];
  labOrders: LabOrdersService[];
}
