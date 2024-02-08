import { ClinicalNoteTypes } from '@enums/global/ClinicalNotes';

export type ClinicalNoteForm = {
  type: ClinicalNoteTypes;
  note: string;
};
