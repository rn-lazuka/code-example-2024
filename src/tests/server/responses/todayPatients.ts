import type { Injection, PatientPlannedInjection } from '@types';
import { injectionFixture, patientPlannedInjectionsFixture } from '@unit-tests/fixtures';

export const defaultInjectionsResponse: Injection[] = [injectionFixture({ id: 1 }), injectionFixture({ id: 2 })];

export const defaultPlannedInjectionsResponse: PatientPlannedInjection[] = [
  patientPlannedInjectionsFixture(),
  patientPlannedInjectionsFixture(),
  patientPlannedInjectionsFixture(),
];
