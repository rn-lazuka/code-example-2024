import { AllergiesInfo, Treatment } from '@enums';

export interface ClinicalInfoForm {
  diagnosis: string;
  medicalHistory: string;
  treatment: Treatment;
  bloodType: string;
  allergies: AllergiesInfo;
  allergiesValue: string[];
  hbsag: string;
  hbsab: string;
  antiHcv: string;
  antiHiv: string;
}
