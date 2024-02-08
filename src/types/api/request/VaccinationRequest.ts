import { DoctorTypes, VaccinationDossingSchedule, VaccinationType } from '@enums';
import { FormFile, VaccineType } from '@types';

export interface VaccinationToAdministerRequest {
  type: VaccinationType;
  prescriptionDate: string;
  dossingSchedule: VaccinationDossingSchedule;
  comments?: string;
  vaccineType: VaccineType;
  administerDate: string;
  prescribedBy?: { source: DoctorTypes; internalDoctorId?: number; name?: string; speciality?: string };
  amount: number;
}

export interface VaccinationAlreadyAdministeredRequest
  extends Omit<VaccinationToAdministerRequest, 'prescribedBy' | 'prescriptionDate'> {
  clinic?: { name: string; branchId?: number };
  administerDate: string;
  files?: FormFile[];
}
