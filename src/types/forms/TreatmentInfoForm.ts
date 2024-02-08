import { DoctorsNameAutocompleteFreeSoloAsyncOptionType } from '@types';

export interface TreatmentInfoForm {
  isAmbulant: boolean | string;
  personInCharge: string;
  nephrologist: string;
  referralInfo: boolean | string;
  referralClinic: string;
  referralDoctor: DoctorsNameAutocompleteFreeSoloAsyncOptionType;
  firstDialysis: Date | null;
  firstCenterDialysis: Date | null;
  primaryNurse: { value: number; label: string; deleted?: boolean } | null;
  comments: string;
}
