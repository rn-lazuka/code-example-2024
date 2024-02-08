import { MedicationFrequency, VaccinationMedicationResolution } from '@enums/global';
import { UserEntity } from '@types';

export interface Medication {
  uid: string;
  name: string;
  description: string;
  deleted: boolean;
}

export interface MedicationsService {
  id: string;
  medication: Medication;
  medicationGroup: string;
  route: string;
  amount: string;
  frequency: MedicationFrequency;
  day: string;
  editedBy?: UserEntity;
  editedAt?: string;
  omittedBy?: UserEntity;
  omittedAt?: string;
  resolution?: VaccinationMedicationResolution;
  administeredBy?: UserEntity;
  administeredAt?: string;
  comments: string;
}
