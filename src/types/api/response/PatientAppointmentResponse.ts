import type { PatientEntity, IsolationGroup, UserEntity } from '@types';
import { DialysisStatus, AppointmentSkipReason } from '@enums';

export interface PatientAppointmentResponse {
  appointmentId: number;
  dialysisId: number;
  status: DialysisStatus;
  date: string;
  startTime: string;
  endTime: string;
  bay: string;
  patient: PatientEntity;
  isolationGroup: IsolationGroup;
  skippedBy?: UserEntity;
  skippedAt?: string;
  editedBy?: UserEntity;
  editedAt?: string;
  skipComment?: string;
  skipReason?: AppointmentSkipReason;
  hasEncounter?: boolean;
  previousSkipped: boolean;
}
