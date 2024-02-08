import type { Injection, IsolationGroup, PatientStatus } from '@types';

export interface TodayPatientPlannedPatientWithInjections {
  id: number;
  appointmentId: number;
  name: string;
  photoPath: string;
  patientStatus: PatientStatus;
  bay: string;
  isolation: IsolationGroup;
  injections: Injection[];
}

export interface TodayPatientsShiftsWithPatients {
  [key: number]: {
    shiftId: number;
    shiftName: string;
    patients: {
      [key: number]: TodayPatientPlannedPatientWithInjections;
    };
  };
}
