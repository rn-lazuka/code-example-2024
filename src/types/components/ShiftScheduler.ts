import { DaysOfWeek } from '@enums';

export interface ShiftSchedulerDefaultValue {
  shiftId: number;
  days: DaysOfWeek[];
}

export interface ShiftSchedulerDay {
  day: DaysOfWeek;
  count: number;
}

export interface ShiftSchedulerShift {
  shiftId: number;
  shiftName: string;
}

export type ShiftSchedulerData = (ShiftSchedulerShift & { dayCountResponse: ShiftSchedulerDay[] })[];
