import { VaccineMedicationOmittingStatus } from '@enums/global';

export interface VaccinationOmittingRequest {
  status: VaccineMedicationOmittingStatus;
  comments?: string;
}
