import { DoctorSpecialities } from '@enums/global';

export interface AutocompleteFreeSoloAsyncOptionType {
  label: string;
  value?: string | number;
  group?: string;
  deleted?: boolean;
  [key: string]: any;
}

export type DoctorsNameAutocompleteFreeSoloAsyncOptionType = AutocompleteFreeSoloAsyncOptionType & {
  specialities?: { id: number; name: DoctorSpecialities }[];
};
