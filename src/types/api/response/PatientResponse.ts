import { Allergy, PatientStatus } from '@types';

export interface PatientAllergiesResponse {
  patientId: number;
  allergy: Allergy;
}

export interface PatientIsolationDetectResponse {
  id: number;
  name: string;
  isolations: string[];
}

export type PatientStatusesResponse = PatientStatus[];
