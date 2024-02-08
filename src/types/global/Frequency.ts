import { MedicationFrequency, MedicationFrequencyLabel } from '@enums';

export type MedicationFrequencyAutocompleteFreeSoloValue = {
  label: MedicationFrequencyLabel | string;
  value: MedicationFrequency | string;
};

export type MedicationFrequencyFormValue = MedicationFrequencyAutocompleteFreeSoloValue | MedicationFrequency;

export type MedicationFrequencySubmitValue = { code: MedicationFrequency; extValue?: string } | undefined;
