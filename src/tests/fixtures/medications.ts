import {
  MedicationDurationTypes,
  DoctorTypes,
  MedicationStatus,
  MedicationPlaces,
  MedicationFrequency,
  StaffSpecialities,
} from '@enums';
import type { MedicationResponse } from '@types';

export const medicationFixture = (data?): MedicationResponse => ({
  id: 'exampleId',
  source: DoctorTypes.External,
  status: MedicationStatus.Unconfirmed,
  place: MedicationPlaces.InCenter,
  medication: {
    uid: 'someUid',
    name: 'medicationName',
    description: 'description',
  },
  medicationGroup: 'antibiotic',
  route: 'route',
  amount: '10',
  amounts: [1, 2],
  frequency: {
    code: MedicationFrequency.THREE_TIMES_PER_WEEK,
  },
  day: 'daily',
  meal: 'meal',
  prescriptionDate: '2022-10-11',
  duration: {
    type: MedicationDurationTypes.Unlimited,
    startDate: '2022-11-11',
    visitsAmount: 0,
    dueDate: '2022-11-12',
  },
  doctor: {
    source: DoctorTypes.Internal,
    name: 'DoctorName',
    speciality: StaffSpecialities.DoctorNephrologist,
  },
  comments: 'some comment',
  enteredBy: {
    id: '1',
    name: 'Karl',
  },
  enteredDate: '2022-10-12',
  editedBy: {
    id: '2',
    name: 'Liza',
  },
  editedDate: '2022-10-13',
  confirmedBy: {
    id: '3',
    name: 'John',
  },
  confirmedDate: '2022-10-14',
  discontinuedBy: { name: 'Abbigail', id: '123' },
  discontinuedDate: '2022-10-15',
  discontinuedReason: 'wrong medication',
  orderedToDiscontinueBy: { name: 'Marco', id: '124' },
  orderedToDiscontinueDate: '2022-10-16',
  administeredAmount: 3,
});
