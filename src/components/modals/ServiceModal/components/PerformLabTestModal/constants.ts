import { LabMealStatus, LabOrderStatus, LabPriority, LabSpecimenType } from '@enums';

export interface LabCreationModalPayload {
  patientId?: string;
  orderId?: number;
  defaultValues?: {
    labId?: string;
    labName?: string;
    patientId?: string;
    patientName?: string;
    procedureName?: string;
    procedureId?: string;
    samplingTime?: string;
    specimenType?: LabSpecimenType;
    mealStatus: LabMealStatus;
    priority: LabPriority;
    status: LabOrderStatus;
    number?: string;
  };
  disabledPatient?: boolean;
}
