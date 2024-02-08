import { AppointmentSkipReason } from '@enums';

export interface SkipAppointmentForm {
  reason: AppointmentSkipReason;
  comment: string;
}
