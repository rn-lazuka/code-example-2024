import { DoctorTypes } from '@enums';

export type DoctorRequestType = {
  source: DoctorTypes;
  internalDoctorId?: number | null;
  name?: string;
  speciality?: string | number | null;
};
