import { VaccinationDossingSchedule, VaccinationMedicationResolution, VaccinationStatus } from '@enums';
import { UserEntity, VaccineType } from '@types';

export type VaccinationService = {
  id: number;
  status: VaccinationStatus;
  amount: number;
  administeredAt: string;
  administeredBy: UserEntity;
  omittedBy: UserEntity;
  omittedAt: string;
  editedBy: UserEntity;
  editedAt: string;
  dossingSchedule: VaccinationDossingSchedule;
  vaccineType: VaccineType;
  comment: string;
  resolution: VaccinationMedicationResolution;
};
