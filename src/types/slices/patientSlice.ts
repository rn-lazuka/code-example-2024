import type { FullPatient, PatientIsolationDetectResponse, PatientStatus } from '@types';

export interface PatientSliceState {
  loading: boolean;
  errors: Error[];
  saveSuccess: boolean;
  patient: Partial<FullPatient> | null;
  patientIsolation: null | undefined | PatientIsolationDetectResponse;
  statusesHistory: PatientStatus[];
  hasTodayEncounter: boolean;
  isServiceEncountered: boolean;
}
