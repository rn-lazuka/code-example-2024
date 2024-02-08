import { LabMealStatus, LabOrderStatus, LabTestTypes, LabPriority, LabSpecimenType, DoctorReviewStatus } from '@enums';
import { Doctor, MedicationsService, UserEntity, UserEntityWithDeleted, VaccinationService } from '@src/types';

export interface DialysisServicesResponse {
  hemodialysis: any;
  medications: MedicationsService[];
  vaccines: VaccinationService[];
  doctorReviews: DoctorReviewServiceResponse[];
  labOrders: LabOrdersServiceResponse[];
  skipInfo: any;
  appointmentDate?: string;
}

export interface LabOrdersServiceResponse {
  appointmentDate: string;
  createdAt: string;
  id: number;
  labId: string;
  labName: string;
  number: number;
  patient: { id: string; name: string };
  planDate: string;
  planId: number;
  priority: LabPriority;
  procedureId: string;
  procedureName: string;
  resultInputType: string;
  specimenType: LabSpecimenType;
  status: LabOrderStatus;
  type: LabTestTypes;
  mealStatus?: LabMealStatus;
  performedAt?: string;
  performedBy?: UserEntity;
  omittedAt?: string;
  omittedBy?: UserEntity;
  comments?: string;
  comment?: string;
  dialysisBased: boolean;
}

export interface DoctorReviewServiceResponse {
  id: number;
  doctor: Doctor;
  status: DoctorReviewStatus;
  note: string;
  administeredBy?: UserEntityWithDeleted;
  omittedBy?: UserEntityWithDeleted;
  administeredAt?: string;
  omittedAt?: string;
}
