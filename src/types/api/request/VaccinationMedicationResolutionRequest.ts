import { VaccinationMedicationResolution, VaccineMedicationOmittingStatus } from '@enums/global';

export interface VaccinationMedicationResolutionRequest {
  resolution?: VaccinationMedicationResolution | VaccineMedicationOmittingStatus;
  administeredBy?: number;
  administeredAt?: string;
  time?: string;
  comments?: string;
  comment?: string;
}
