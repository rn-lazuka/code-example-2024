import { ClinicalEvent, ShiftsResponse } from '@types';
import { ClinicalScheduleEventType } from '@enums';

export type ClinicalScheduleEventFilter = {
  name: ClinicalScheduleEventType;
  selected: boolean;
};

export type ClinicalScheduleEvents = { [key: number]: { [key: string]: ClinicalEvent[] } };

export interface ClinicalScheduleSliceState {
  loading: boolean;
  error: string | null;
  clinicalScheduleDate: Date;
  events: ClinicalScheduleEvents;
  shifts: ShiftsResponse;
  filters: ClinicalScheduleEventFilter[];
}
