import type { PatientPlannedInjection, Shift, TodayPatientsShiftsWithPatients } from '@types';

export const convertPlannedInjectionsToShiftsWithInjections = (
  shifts: Shift[],
  plannedInjections: PatientPlannedInjection[],
): TodayPatientsShiftsWithPatients => {
  const shiftsData = shifts.reduce((acc, shift) => {
    return {
      ...acc,
      [shift.id]: {
        shiftId: shift.id,
        shiftName: shift.name,
        patients: {},
      },
    };
  }, {});

  return plannedInjections.reduce((acc, { shiftId, shiftName, ...data }) => {
    const accClone: TodayPatientsShiftsWithPatients = { ...acc };
    if (!accClone[shiftId]) {
      return accClone;
    }

    const { injections, ...otherInjectionData } = data;

    if (!accClone[shiftId].patients[otherInjectionData.patientId]) {
      const { patientId, patientName, appointmentId, ...patientData } = otherInjectionData;
      accClone[shiftId].patients[patientId] = {
        ...patientData,
        id: patientId,
        name: patientName,
        appointmentId,
        injections,
      };
    }

    return accClone;
  }, shiftsData as TodayPatientsShiftsWithPatients);
};
