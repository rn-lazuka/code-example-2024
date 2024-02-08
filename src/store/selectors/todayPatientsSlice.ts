import { PatientStatuses } from '@enums';
import { createSelector } from '@reduxjs/toolkit';

export const selectorTodayPatientsAppointmentsWithStatusPhoto = createSelector(
  (state) => state.todayPatients.appointments,
  (appointments) =>
    appointments.map((appointment) => ({
      ...appointment,
      name: {
        ...appointment.name,
        photoPath:
          appointment.patientStatus === PatientStatuses.Walk_In ||
          appointment.patientStatus === PatientStatuses.Discharged ||
          appointment.patientStatus === PatientStatuses.Dead
            ? undefined
            : appointment.name.photoPath,
      },
    })),
);
