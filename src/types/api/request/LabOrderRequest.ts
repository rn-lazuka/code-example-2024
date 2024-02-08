import { LabMealStatus, LabOrderStatus } from '@enums';

export interface LabOrderSearchRequestParams {
  from?: string;
  to?: string;
  patientId?: number;
  appointmentId?: number;
  procedureIds?: number[];
  labIds?: number[];
  orderStatus?: LabOrderStatus;
  orderNumber?: number;
  shifts?: string[];
}

export interface LabOrderSearchPageableParams {
  page?: number;
  size?: number;
  sort?: string[];
}

export interface PerformLabOrderRequestParams {
  labId: number;
  performedAt: string;
  performedBy: number;
  mealStatus: LabMealStatus;
}
