import { PatientStatuses } from '@enums';

export const noDischargedPatientsFilter = (patient: { status: PatientStatuses }) => {
  return patient?.status ? patient.status !== PatientStatuses.Discharged : true;
};
