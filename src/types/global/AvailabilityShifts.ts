export interface AvailabilityShift {
  date: string;
  shifts: { id: string; name: string }[];
}

export type AvailabilityShifts = AvailabilityShift[];
