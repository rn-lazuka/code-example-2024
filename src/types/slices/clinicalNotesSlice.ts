import type { ClinicalNoteForm, ClinicalNote, Pagination } from '@types';
import { ClinicalNotesPlaces, ClinicalNoteTypes, CustomClinicalNoteTypes } from '@enums';

export type EditClinicalNotePayload = ClinicalNoteForm & { patientId: number };

export type ClinicalNotesFilters = {
  patient: { label: string; id: number } | null;
  from: Date | null;
  to: Date;
  noteTypes: { name: ClinicalNoteTypes | CustomClinicalNoteTypes; selected: boolean }[];
};

export type ClinicalNotesFiltersError = {
  from: string | null;
  to: string | null;
};

export type AddOrEditClinicalNotePayload = {
  isAdding: boolean;
  clinicalNote: ClinicalNoteForm;
  patientId: number;
  place: ClinicalNotesPlaces;
};

export type GetClinicalNotesListPayload = {
  patientId?: number;
  paginationValue?: number;
  place: ClinicalNotesPlaces;
};

export type DeleteClinicalNotePayload = Pick<GetClinicalNotesListPayload, 'patientId' | 'place'>;

export type ClinicalNoteTypeOptionType = { label: string; value: ClinicalNoteTypes }[];

export type ClinicalNotesSliceState = {
  submitting: boolean;
  loading: boolean;
  saveSuccess: boolean;
  error: string | null;
  clinicalNoteForm: ClinicalNoteForm | null;
  clinicalNotes: ClinicalNote[];
  filters: ClinicalNotesFilters;
  filtersError: ClinicalNotesFiltersError;
  pagination: Pagination;
  selectedClinicalNoteType: ClinicalNoteTypes | null;
  availableClinicalNoteTypes: ClinicalNoteTypeOptionType;
  selectedClinicalNoteId: number | null;
};
