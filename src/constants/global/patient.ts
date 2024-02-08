import { PatientStatuses } from '@enums';

export const patientStatusesList = [
  { title: 'modal.permanent', value: PatientStatuses.Permanent, dataTest: 'patientPermanentStatus' },
  { title: 'modal.walkIn', value: PatientStatuses.Walk_In, dataTest: 'patientWalkInStatus' },
  { title: 'modal.visiting', value: PatientStatuses.Visiting, dataTest: 'patientVisitingStatus' },
];
