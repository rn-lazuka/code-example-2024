import { DialysisPatient } from '@types';
import { AppointmentStatus, DialysisStatus } from '@enums';

export interface DialysisResponse {
  patient: DialysisPatient;
  appointmentId: string;
  appointmentDate: string;
  status: DialysisStatus | AppointmentStatus;
  startTime: string;
  endTime: string;
  bay: string;
}

export interface HdReadingRecordsResponse {
  id: number;
  time: string;
  systolicBp: number;
  diastolicBp: number;
  hr: string;
  ap: string;
  vp: number;
  tmp: number;
  ufRate: number;
  qb: number;
  qd: number;
  cumHeparin?: number;
  cumUf: number;
  totalUf?: number;
  conductivity: number;
  dialysateTemp: number;
  heparinRate: number;
  ktV?: number;
  urr?: number;
  duringHdNotes?: string;
  signedBy: string;
  bay: string;
}
