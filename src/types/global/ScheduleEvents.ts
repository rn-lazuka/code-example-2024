import {
  ClinicalScheduleEventType,
  TargetAudience,
  DoctorSpecialities,
  AddHocEventTypes,
  LabOrderStatus,
} from '@enums';

export interface CustomEvent {
  id: string;
  type: ClinicalScheduleEventType.CustomEvent;
  title: string;
  comment: string;
  date: string;
  isAllDay: boolean;
  startTime: string;
  endTime: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    photoPath: string;
  };
  modifiedAt?: string;
  modifiedBy?: {
    id: string;
    name: string;
    photoPath: string;
  };
}

export interface QuarterlyBloodTestEvent {
  id: string;
  type: ClinicalScheduleEventType.QuarterlyBloodTest;
  lab: {
    id: string;
    name: string;
    deleted: boolean;
  };
  comment: string;
  date: string;
  isAllDay: boolean;
  startTime: string;
  endTime: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    photoPath: string;
  };
  modifiedAt?: string;
  modifiedBy?: {
    id: string;
    name: string;
    photoPath: string;
  };
}
export interface StaffHepBVaccinationEvent {
  id: string;
  type: ClinicalScheduleEventType.StaffHepBVaccination;
  date: string;
  isAllDay: boolean;
  startTime: string;
  endTime: string;
  comment: string;
}
export interface StaffSerologyScreeningEvent {
  id: string;
  type: ClinicalScheduleEventType.StaffSerologyScreening;
  date: string;
  isAllDay: boolean;
  startTime: string;
  endTime: string;
  comment: string;
}
export interface PICVisitEvent {
  id: string;
  type: ClinicalScheduleEventType.PICVisit;
  date: string;
  isAllDay: boolean;
  startTime: string;
  endTime: string;
  comment: string;
  doctor: { name: string; internalDoctorId: string; speciality: DoctorSpecialities };
  targetAudience: TargetAudience;
  dialysisRelated: boolean;
  patients?: { id: string; name: string; photoPath: string }[];
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    photoPath: string;
  };
  modifiedAt?: string;
  modifiedBy?: {
    id: string;
    name: string;
    photoPath: string;
  };
}
export interface NephrologistVisitEvent {
  id: string;
  type: ClinicalScheduleEventType.NephrologistVisit;
  date: string;
  isAllDay: boolean;
  startTime: string;
  endTime: string;
  comment: string;
  doctor: { name: string; internalDoctorId: string; speciality: DoctorSpecialities };
  targetAudience: TargetAudience;
  dialysisRelated: boolean;
  patients?: { id: string; name: string; photoPath: string }[];
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    photoPath: string;
  };
  modifiedAt?: string;
  modifiedBy?: {
    id: string;
    name: string;
    photoPath: string;
  };
}

export interface IndividualLabTestPlanEventLabOrder {
  id: string;
  procedureName: string;
  status: LabOrderStatus;
}

export interface IndividualLabTestPlanEvent {
  id: string;
  patientId: string;
  patientName: string;
  patientPhotoPath?: string;
  labOrders: IndividualLabTestPlanEventLabOrder[];
  type: AddHocEventTypes.LAB_TEST;
  isAllDay: boolean;
}

export type ClinicalEvent =
  | CustomEvent
  | QuarterlyBloodTestEvent
  | StaffHepBVaccinationEvent
  | StaffSerologyScreeningEvent
  | PICVisitEvent
  | NephrologistVisitEvent;
