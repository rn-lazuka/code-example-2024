import type { RootState } from '@types';
import { PatientStatuses } from '@enums';
import { createSelector } from '@reduxjs/toolkit';

export const selectorOverviewPatientsWithStatusPhotoPath = createSelector(
  (state: RootState) => state.overviewPatients.patients,
  (patients) =>
    patients.map((patient) => ({
      ...patient,
      name: {
        ...patient.name,
        photoPath:
          patient.status === PatientStatuses.Walk_In ||
          patient.status === PatientStatuses.Discharged ||
          patient.status === PatientStatuses.Dead
            ? undefined
            : patient.name.photoPath,
      },
    })),
);
