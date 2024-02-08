import type { DoctorRequestType } from '@types';
import { MedicationDurationTypes, MedicationPlaces } from '@enums';
import { MedicationFrequencySubmitValue } from '@types';

export interface MedicationRequest {
  place: MedicationPlaces;
  medicationUid: string | null;
  medicationName: string | null;
  medicationGroup: string;
  route: string;
  amount: string | null;
  amounts: number[] | null;
  frequency: MedicationFrequencySubmitValue;
  day: string;
  meal: string;
  prescriptionDate: string;
  duration: {
    type: MedicationDurationTypes | null;
    startDate: string | null | Date;
    visitsAmount: number | null;
    dueDate: string | null | Date;
  };
  doctor: DoctorRequestType;
  comments: string;
}

export interface DiscontinueMedicationRequest {
  orderedBy?: DoctorRequestType;
  date: string;
  reason?: string;
  medicationId: string;
  patientId: string;
}
