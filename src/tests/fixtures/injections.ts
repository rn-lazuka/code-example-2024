import type { Injection, PatientPlannedInjection } from '@types';
import uniqId from 'uniqid';
import { InjectionStatus, InjectionType } from '@enums';
import { patientStatusFixture } from '@unit-tests/fixtures/patient';

let id = 0;

export const injectionFixture = (data: Partial<Injection> = {}): Injection => ({
  id: id++,
  type: InjectionType.MEDICATION,
  name: `Injection - ${id} - ${uniqId()}`,
  dosage: '2nd',
  amount: 1,
  prepared: false,
  status: InjectionStatus.PENDING,
  ...data,
});

export const patientPlannedInjectionsFixture = (
  data: Partial<PatientPlannedInjection> = {},
): PatientPlannedInjection => ({
  shiftId: 7,
  shiftName: 'Shift 7',
  patientId: 1,
  patientName: 'Patient Name',
  appointmentId: 1,
  bay: 'Bay 1',
  photoPath: 'photo/path/img.png',
  patientStatus: patientStatusFixture(),
  isolation: {
    id: 1,
    isolations: [],
    name: 'Non-infection',
  },
  injections: [injectionFixture(), injectionFixture(), injectionFixture()],
  ...data,
});
