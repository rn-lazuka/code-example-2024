import { AmTypes, PatientStatuses } from '@enums';
import { Document } from '@src/types';

export interface OverviewPatient {
  id?: string;
  name: string;
  photoPath?: string;
  document: Document;
  gender: {
    code?: string;
    extValue?: string;
  };
  virology: {
    hbsag: string;
    hbsab: string;
    antiHcv: string;
    antiHiv: string;
  };
  dialysis: TreatmentsCounter;
  hdSchedule: ('MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY')[];
  amTypes: AmTypes[];
  status: PatientStatuses;
}

export interface TreatmentsCounter {
  planned: number;
  passed: number;
  missed?: number;
}

export interface OverviewPatientTable {
  content: OverviewPatient[];
  totalElements: number;
  totalPages: number;
  size: number;
  first: boolean;
  last: boolean;
}
