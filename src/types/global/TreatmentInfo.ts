import { DoctorRequestType } from '@types';

interface PersonEntity {
  id: string;
  name: string;
  specialities: { id: number; name: string }[];
}

export interface TreatmentInfo {
  isAmbulant?: boolean;
  personInCharge?: PersonEntity;
  nephrologist?: PersonEntity;
  referralInfo?: {
    status: boolean;
    clinic: string;
    doctor: DoctorRequestType;
  };
  firstDialysis?: string;
  firstCenterDialysis?: string;
  comments?: string;
  primaryNurse: { id: number; name: string; deleted: boolean };
}
