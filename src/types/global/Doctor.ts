import { DoctorSpecialities, DoctorTypes, StaffSpecialities } from '@enums';

export interface Doctor {
  name?: string;
  source: DoctorTypes;
  internalDoctorId?: number;
  speciality?: DoctorSpecialities;
  deleted?: boolean;
  userId?: number;
}

export type DoctorWithStaffSpecialities = Omit<Doctor, 'speciality'> & { speciality: StaffSpecialities };
