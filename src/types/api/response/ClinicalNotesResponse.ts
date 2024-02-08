import { ClinicalNoteTypes, PatientStatuses } from '@enums';
import { PaginationResponse, UserEntityWithDeleted } from '@types';

export type ClinicalNote = {
  id: number;
  patient: { id: number; name: string; status: PatientStatuses };
  type: ClinicalNoteTypes;
  note: string;
  details?: string;
  manuallyCreated: boolean;
  enteredAt: Date | string;
  enteredBy: UserEntityWithDeleted;
  editedBy?: UserEntityWithDeleted;
  editedAt?: string;
};

export type ClinicalNotesResponse = {
  content: ClinicalNote[];
} & PaginationResponse;
