import { VaccinationDossingSchedule, VaccinationStatus, VaccinationType } from '@enums';
import { FormFile } from '@types';
import type { AutocompleteFreeSoloAsyncOptionType } from '@types';

export interface VaccinationForm {
  id?: number;
  status?: VaccinationStatus;
  type: VaccinationType;
  prescriptionDate?: string | Date;
  amount: number;
  dossingSchedule: VaccinationDossingSchedule;
  comments?: string;
  vaccineType?: { label: string; value: number };
  administeredVaccineType?: string;
  administerDate: string | Date;
  prescribedBy?: AutocompleteFreeSoloAsyncOptionType;
  doctorsSpecialityText?: string;
  clinic?: { label: string; value: number | string };
  files?: FormFile[];
  doctorsSpecialitySelect?: number;
}
