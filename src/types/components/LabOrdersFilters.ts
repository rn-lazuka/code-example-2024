import { AutocompleteAsyncOptionType } from '@components/autocompletes/AutocompleteAsync/AutocompleteAsync';
import { SelectOptionProps } from '@components/Select/Select';
import { LabOrdersStatusFilters, LabTestTypes } from '@enums';

export interface LabOrdersFilters {
  from: Date | null;
  to: Date | null;
  planFrom: Date | null;
  planTo: Date | null;
  appointmentFrom: Date | null;
  appointmentTo: Date | null;
  submissionFrom: Date | null;
  submissionTo: Date | null;
  resultFrom: Date | null;
  resultTo: Date | null;
  patient: AutocompleteAsyncOptionType | null | undefined;
  appointmentId?: string;
  procedures: SelectOptionProps[];
  labIds: string[];
  order: AutocompleteAsyncOptionType | null | undefined;
  shifts: SelectOptionProps[];
  type: { label: string; value: LabTestTypes } | null;
}

export type LabOrdersStatusFilter = {
  name: LabOrdersStatusFilters;
  selected: boolean;
  badge: string;
};

export interface LabOrdersFiltersErrors {
  from: string | null;
  to: string | null;
  planFrom: string | null;
  planTo: string | null;
  appointmentFrom: string | null;
  appointmentTo: string | null;
  submissionFrom: string | null;
  submissionTo: string | null;
  resultFrom: string | null;
  resultTo: string | null;
}
