import { PatientHospitalizationReason, PatientStatuses } from '@enums';
import type { Kin, FileDocument, Gender } from '@types';

export type PatientStatusChangeRequest = {
  patientId: string | number;
  isHistory: boolean;
  statusId: string | number | null;
  status: PatientStatuses;
  details?: string;
  comment?: string;
  files?: FileDocument[] | null;
  returningDate?: string | null;
  deathDate?: string | null;
  reason: PatientHospitalizationReason | null;
  family?: {
    kins: Kin[] | null;
  };
  gender: Gender | null;
  clinic?: string;
};
