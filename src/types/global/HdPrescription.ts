import {
  HdPrescriptionStatuses,
  DaysOfWeek,
  DialyzerUseType,
  HdPrescriptionPrescriberSource,
  HDPrescriptionScheduleFrequency,
  PatientIsolationFilterNames,
} from '@enums';

export interface Shift {
  id: number;
  name: string;
  timeStart: string;
  timeEnd: string;
}

export interface HdPrescription {
  id: string;
  enteredAt: string;
  prescriptionDate: string;
  prescribedBy: {
    name: string;
    source: HdPrescriptionPrescriberSource;
    internalDoctorId?: number;
    speciality?: string;
    deleted?: boolean;
  };
  enteredBy?: {
    id: string | number;
    name: string;
    deleted?: boolean;
  };
  discontinuedBy?: {
    id: string;
    name: string;
  };
  discontinuedAt: string;
  discontinuedReason: string;
  frequencyCode: string;
  scheduleCode: string;
  bloodFlow: number;
  flow: number;
  dryWeight: number;
  dialyzerUseType: DialyzerUseType;
  dialyzerBrand: string;
  surfaceArea: number;
  calcium: number;
  sodiumStart: number;
  sodiumEnd: number;
  potassium: number;
  temperature: number;
  anticoagulantType: string;
  primeDose: number;
  bolusDose: number;
  hourlyDose: number;
  comments: string;
  status: HdPrescriptionStatuses;
  userId: number;
  isolationGroup: {
    id: number;
    name: string;
    isolations: (
      | PatientIsolationFilterNames.hepB
      | PatientIsolationFilterNames.hepC
      | PatientIsolationFilterNames.hiv
    )[];
  };
  schedule: {
    recurrent?: {
      startedAt: Date | string;
      endsAt: Date | string;
      duration: number;
      frequency: HDPrescriptionScheduleFrequency;
      daysOfWeek: DaysOfWeek[];
      shift: {
        id: number;
        name: string;
        deleted: boolean;
      };
    };
    adHoc?: {
      dateShifts: {
        date: string;
        shift: {
          id: number;
          name: string;
          deleted: boolean;
        };
        duration: number;
      }[];
    };
  };
}

export interface HdPrescriptionViewTable {
  content: HdPrescription[];
}
