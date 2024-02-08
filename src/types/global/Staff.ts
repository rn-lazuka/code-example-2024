import { StaffSpeciality } from '@src/enums';
import { Document, Gender, FileDocument, Phone } from '@types';

export interface Speciality {
  id: number;
  name: StaffSpeciality;
}

export interface StaffEntity {
  id: number;
  name: string;
  photoPath: string;
  document: Document;
  gender: Gender;
  roles: string[];
  specialities: string[];
}

export interface Staff extends StaffEntity {
  login: string;
  profRegNumber: string;
  phone: Phone;
  email: string;
  address: string;
  files: FileDocument[];
}

export interface StaffRole {
  name: string;
  selected: boolean;
  badge: number;
}
