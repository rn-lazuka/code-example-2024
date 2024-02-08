import { ClinicalNote } from '@types';
import { ClinicalNoteTypes, PatientStatuses } from '@enums';

export const clinicalNoteFixture: ClinicalNote = {
  id: 1,
  patient: { id: 1, name: 'Test Name', status: PatientStatuses.Permanent },
  type: ClinicalNoteTypes.DoctorNote,
  note: 'Test note',
  enteredAt: new Date(),
  enteredBy: {
    id: 2,
    name: 'Test Entered At',
    deleted: false,
  },
  manuallyCreated: false,
};
