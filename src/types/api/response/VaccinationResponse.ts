import { VaccinationDossingSchedule, VaccinationStatus } from '@enums';
import { Doctor, UserEntity, FileDocument } from '@types';

export interface VaccineType {
  code?: number;
  name: string;
}

export interface VaccinationResponse {
  id: number;
  status: VaccinationStatus;
  dateToAdminister?: string;
  administeredAt?: string;
  administeredBy?: UserEntity;
  amount: number;
  omittedBy?: UserEntity;
  omittedAt: string;
  prescriptionDate: string;
  prescribedBy: Doctor;
  dossingSchedule: VaccinationDossingSchedule;
  vaccineType: VaccineType;
  clinic: {
    branchId: number;
    name: string;
  };
  files: FileDocument[];
  comments: string[];
  enteredBy: UserEntity;
  enteredAt: string;
  editedBy: UserEntity;
  editedAt: string;
}
