import { PatientHospitalizationReason, PatientStatuses } from '@enums';
import type { FileDocument } from '@types';

export interface PatientChangeStatusHistoryResponse {
  statusId: number;
  status: PatientStatuses;
  comment?: string;
  reason?: PatientHospitalizationReason;
  details?: string;
  returningDate?: string;
  files?: FileDocument[];
  createdAt: string;
  updatedAt: string;
}
