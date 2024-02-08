import type { HdPrescriptionFormOptionsType } from '@types';
import {
  DaysOfWeek,
  RestDay,
  ThricePerWeekFridayRestDay,
  ThricePerWeekSundayRestDay,
  TwicePerWeekFridayRestDay,
  TwicePerWeekSundayRestDay,
} from '@enums';

export const getHdSchedulingFormOncePerWeekOptions = (
  restDay: RestDay,
  options: HdPrescriptionFormOptionsType[],
): HdPrescriptionFormOptionsType[] => {
  const oncePerWeekDays = Object.values(DaysOfWeek).filter((day: any) => day !== restDay);
  return options.filter((option) => oncePerWeekDays.includes(option.value));
};

export const getHdSchedulingFormTwicePerWeekOptions = (
  restDay: RestDay,
  options: HdPrescriptionFormOptionsType[],
): HdPrescriptionFormOptionsType[] => {
  const twicePerWeekDays: any[] =
    restDay === RestDay.FRIDAY ? Object.values(TwicePerWeekFridayRestDay) : Object.values(TwicePerWeekSundayRestDay);
  return options.filter((option) => twicePerWeekDays.includes(option.value));
};

export const getHdSchedulingFormThricePerWeekOptions = (
  restDay: RestDay,
  options: HdPrescriptionFormOptionsType[],
): HdPrescriptionFormOptionsType[] => {
  const thricePerWeekDays: any[] =
    restDay === RestDay.FRIDAY ? Object.values(ThricePerWeekFridayRestDay) : Object.values(ThricePerWeekSundayRestDay);
  return options.filter((option) => thricePerWeekDays.includes(option.value));
};
