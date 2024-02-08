import { VaccinationMedicationResolution } from '@enums/global';

export interface VaccinationMedicationAdministeringForm {
  administeredBy?: { label: string; value: number | string };
  administeredTime: Date;
  status?: VaccinationMedicationResolution;
  comments?: string;
  comment?: string;
}
