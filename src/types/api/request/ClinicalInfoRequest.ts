import { Treatment } from '@enums';
import type { VirologyStatus, Allergy } from '@types';

export interface ClinicalInfoRequest {
  diagnosis?: string;
  medicalHistory?: string;
  treatment?: Treatment;
  bloodType?: string;
  allergy: Allergy;
  virology?: VirologyStatus;
}
