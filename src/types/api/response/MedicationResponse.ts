import { DoctorTypes, MedicationFrequency, MedicationDurationTypes, MedicationPlaces, MedicationStatus } from '@enums';
import { Medication, DoctorWithStaffSpecialities } from '@types';

export type FrequencyResponse = { code: MedicationFrequency; extValue?: string };

export interface MedicationResponse {
  id: string;
  source: DoctorTypes;
  status: MedicationStatus;
  place: MedicationPlaces;
  medication: Medication;
  medicationName: string;
  medicationGroup: string;
  route: string;
  amount: string;
  amounts: number[];
  frequency?: FrequencyResponse;
  day: string;
  meal: string;
  prescriptionDate: string;
  duration: {
    type: MedicationDurationTypes;
    startDate: string;
    visitsAmount: number;
    dueDate: string;
  };
  doctor: DoctorWithStaffSpecialities;
  comments: string;
  enteredBy: {
    id: string;
    name: string;
  };
  enteredDate: string;
  editedBy: {
    id: string;
    name: string;
  };
  editedDate: string;
  confirmedBy: {
    id: string;
    name: string;
  };
  confirmedDate: string;
  discontinuedBy: {
    name: string;
    id: string;
  };
  orderedToDiscontinueBy: {
    name: string;
    id: string;
  };
  orderedToDiscontinueDate: string;
  discontinuedDate: string;
  discontinuedReason: string;
  administeredAmount: number;
}
