import {
  OneDayCalendarAppointmentStatus,
  LabOrderStatus,
  LabTestTypes,
  DoctorReviewStatus,
  DoctorSpecialities,
  DoctorTypes,
} from '@enums';
import { MedicationsService, VaccinationService } from '@src/types';

export interface HemodialysisServices {
  duration: number;
  endedAt: string;
  id: number;
  startedAt: string;
  status: OneDayCalendarAppointmentStatus;
  location: {
    id: string;
    name: string;
  };
}
export interface ShiftServices {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
}

export interface LabOrdersService {
  id: number;
  procedureName: string;
  status: LabOrderStatus;
  type: LabTestTypes;
  createdAt: string | Date;
  dialysisBased: boolean;
}

export interface ShortServices {
  hemodialysis: HemodialysisServices;
  labOrders?: LabOrdersService[];
  medications?: MedicationsService[];
  shift: ShiftServices;
  vaccines?: VaccinationService[];
  doctorReviews?: DoctorReviewService[];
}

export interface DoctorReviewService {
  id: number;
  status: DoctorReviewStatus;
  isAllDay: boolean;
  startTime: string;
  endTime: string;
  doctor: {
    deleted: boolean;
    internalDoctorId: string;
    name: string;
    source: DoctorTypes;
    speciality: DoctorSpecialities;
  };
}
