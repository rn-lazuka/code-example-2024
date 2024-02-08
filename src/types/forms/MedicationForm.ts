import type { DoctorsNameAutocompleteFreeSoloAsyncOptionType, MedicationFrequencyFormValue } from '@types';
import { MedicationDurationTypes, MedicationFrequency, MedicationFrequencyLabel, MedicationPlaces } from '@enums';

export type Option = {
  label: string;
  value: string;
  [key: string]: any;
};

export type MedicationFrequencyType = { label: MedicationFrequencyLabel; value: MedicationFrequency };

export interface MedicationForm {
  id: string;
  place: MedicationPlaces;
  nameDrug: {
    uid: string;
    label: string;
    description: string;
  } | null;
  medicationGroup: Option | null;
  route: Option | null;
  amount: string;
  amounts: number[];
  frequencyLongTerm: MedicationFrequencyFormValue;
  frequencyDialysisRelated?: string;
  day: string;
  meal: Option | null;
  prescriptionDate: string | null | Date;
  durationType: MedicationDurationTypes;
  startDate: string | null | Date;
  visitsAmount: number;
  dueDate: string | null | Date;
  doctorsName: DoctorsNameAutocompleteFreeSoloAsyncOptionType;
  doctorsSpecialityText: string;
  doctorsSpecialitySelect: number | null;
  comments: string;
}
