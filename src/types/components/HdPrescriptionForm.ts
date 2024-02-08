import {
  DaysOfWeek,
  ThricePerWeekFridayRestDay,
  ThricePerWeekSundayRestDay,
  TwicePerWeekFridayRestDay,
  TwicePerWeekSundayRestDay,
} from '@enums';

export type HdPrescriptionFormOptionsType = {
  label: string;
  value: DaysOfWeek &
    TwicePerWeekFridayRestDay &
    TwicePerWeekSundayRestDay &
    ThricePerWeekFridayRestDay &
    ThricePerWeekSundayRestDay;
};
