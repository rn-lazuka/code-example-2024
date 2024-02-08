import { OneDayCalendarAppointmentStatus } from '@enums';

export interface AppointmentSchedule {
  id: number;
  patientId: number;
  patientName: string;
  shiftId: number;
  startTime?: string;
  endTime?: string;
  isolationGroupId?: number;
  status: OneDayCalendarAppointmentStatus;
  duration: number;
  patientPhotoPath?: string;
  hasEncounter: boolean;
  previousSkipped: boolean;
}

export type AppointmentsSchedulesResponse = AppointmentSchedule[];
