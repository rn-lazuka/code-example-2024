import type { MedicationForm, MedicationResponse } from '@types';

export type MedicationSliceState = {
  loading: boolean;
  saveSuccess: boolean;
  isFileLoading: boolean;
  error: any;
  medicationForm: MedicationForm | null;
  medications: MedicationResponse[];
};
