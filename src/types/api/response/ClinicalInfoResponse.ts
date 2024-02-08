import { Treatment } from '@enums';
import type { VirologyStatus, Allergy } from '@types';

export interface ClinicalInfoResponse {
  diagnosis?: string;
  medicalHistory?: string;
  treatment?: Treatment;
  bloodType?: string;
  allergy: Allergy;
  virology?: VirologyStatus;
}
