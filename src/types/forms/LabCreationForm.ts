import { AutocompleteFreeSoloOptionType } from '@components/autocompletes';
import { LabMealStatus, LabOrderStatus, LabSpecimenType } from '@enums';

export interface LabCreationForm {
  patientId: string;
  procedureId: string;
  specimenType: LabSpecimenType;
  labId: string;
}

export interface UrgentLabTestForm {
  patient: { label: string; value: string };
  laboratory: { label: string; value: string } | null;
  procedure: { label: string; value: string } | null;
  specimenType: string | null;
}

export interface CreateIndividualLabTestPlanForm extends LabCreationForm {
  dialysisDay: boolean;
  planedDates: string[];
}

export type CreateIndividualLabTestPlanFormRaw = Pick<CreateIndividualLabTestPlanForm, 'dialysisDay'> & {
  patient: { label: string; value: string } | null;
  procedure: AutocompleteFreeSoloOptionType;
  laboratory: { label: string; value: string } | null;
  specimenType: LabSpecimenType;
  planeDates: { date: null | Date; status: LabOrderStatus }[];
};

export interface CreateQuarterlyBTForm {
  patientId: number;
  quarters: { number: number; procedureId: number }[];
}

export interface PerformLabTestForm extends Partial<UrgentLabTestForm> {
  performedAt: Date;
  performedBy: { label: string; value: string | number };
  mealStatus: LabMealStatus;
}
