import { AppointmentStatus, DialysisStatus } from '@enums';

type Patient = {
  patientName: string;
  gender: {
    code: string;
    extValue: string;
  };
  document: {
    type: string;
    number: string;
  };
  birthDate: string;
};

export interface DialysisProcessInfoRequest {
  appointmentId: number;
  dialysisId: number;
  status: DialysisStatus | AppointmentStatus | null;
  startTime?: string;
  endTime?: string;
  bay?: string;
  patient: Patient;
}
