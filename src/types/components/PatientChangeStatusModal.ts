import { PatientStatus } from '@types';

export interface PatientChangeStatusModalPayload {
  isHistory: boolean;
  statusData?: PatientStatus;
}
