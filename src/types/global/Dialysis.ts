import { AppointmentSkipReason, DialysisStatus, PatientStatuses, PostHdSummary } from '@enums';
import { CvcAccessManagementResponse, PreHdDailyzer, UserEntity, VascularAccessManagementResponse } from '@types';

export interface DialysisPatient {
  id: number;
  patientName: string;
  status: PatientStatuses;
  document: {
    type: string;
    number: string;
  };
  birthDate: string;
  gender: {
    code: string;
    extValue: string;
  };
}

export interface DialysisSummary {
  patient: DialysisPatient;
  appointmentId: string;
  date: string;
  status: {
    activeStep: DialysisStatus;
    currentStep: DialysisStatus;
  };
  startTime: string;
  endTime: string;
  bay: string;
  skippedBy?: UserEntity;
  skippedAt?: string;
  editedBy?: UserEntity;
  editedAt?: string;
  skipComment?: string;
  skipReason?: AppointmentSkipReason;
  hasEncounter?: boolean;
  previousSkipped: boolean;
  withDialysis: boolean;
}

export interface Dialysis {
  accessCondition: string;
  accessManagements: (VascularAccessManagementResponse | CvcAccessManagementResponse)[];
  anticoagulant: {
    type: string;
    primeDose: string;
    bolusDose: string;
    hourlyDose: string;
  };
  calculations: {
    dryWeight: string;
    idwg: string;
    infusion: string;
    lastSessionWeight: string;
    preSessionWeight: string;
    reinfusionVolume: string;
    ufTarget: string;
    weightDifference: string;
  };
  dialysate: {
    calcium: string;
    flow: string;
    potassium: string;
    sodiumEnd: string;
    sodiumStart: string;
    temperature: string;
  };
  dialyzer: PreHdDailyzer;
  id: string;
  indicators: {
    bodyTemperature: string;
    sittingDiastolicBloodPressure: string;
    sittingPulse: string;
    sittingSystolicBloodPressure: string;
    standingDiastolicBloodPressure: string;
    standingPulse: string;
    standingSystolicBloodPressure: string;
  };
  initial: {
    location: { id: string; name: string };
    duration: string;
    today: string;
    treatmentNumber: string;
  };
  notes: string;
  patientCondition: string;
}

export interface PostHd {
  weight: {
    preSessionWeight: string;
    postSessionWeight?: string;
    weightLoss?: string;
  };
  indicators?: {
    standingSystolicBloodPressure: string;
    standingDiastolicBloodPressure: string;
    standingPulse: string;
    sittingSystolicBloodPressure: string;
    sittingDiastolicBloodPressure: string;
    sittingPulse: string;
    bodyTemperature: string;
  };
  patientCondition?: string;
  accessCondition?: string;
  bleedingStatus?: string;
  summary?: {
    type: PostHdSummary;
    text: string;
  };
}
