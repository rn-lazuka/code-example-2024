import { FileTypes, PatientHospitalizationReason, PatientStatuses } from '@enums';
import type { Kin } from '@types';
import { FormFile, FormFiles } from '@types';

export interface PatientStatusForm extends FormFiles {
  status: PatientStatuses;
  reason?: PatientHospitalizationReason;
  comment?: string;
  details?: string;
  returningDate?: Date | null;
  genderCode?: string;
  genderExtValue?: string;
  kins: Kin[];
  [FileTypes.DeathProof]: FormFile[];
  [FileTypes.DischargeNotes]: FormFile[];
  clinic?: string;
  deathDate?: Date | null;
}
