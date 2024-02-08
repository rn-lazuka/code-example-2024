import { PatientStatuses } from '@enums';

export const noDeadPatientsFilter = (patient: { status: PatientStatuses }) => {
  return patient?.status ? patient.status !== PatientStatuses.Dead : true;
};
