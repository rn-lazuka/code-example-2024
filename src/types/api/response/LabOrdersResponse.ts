import { LabMealStatus, LabOrderStatus, LabTestTypes, LabPriority, LabResultInputType, LabSpecimenType } from '@enums';
import type { PatientWithDocument } from '@types';
import { UserEntity } from '@types';

export interface LabOrdersContent {
  id: number;
  type: LabTestTypes;
  appointmentDate: string;
  planDate: string;
  planId: string;
  patient: PatientWithDocument;
  procedureId: number;
  procedureName: string;
  procedureDeleted?: boolean;
  labId: number;
  labName: string;
  labDeleted?: boolean;
  createdAt: string;
  sampledAt: string;
  performedAt: string;
  number: number;
  mealStatus: LabMealStatus;
  specimenType: LabSpecimenType;
  priority: LabPriority;
  shift: string;
  resultInputType: LabResultInputType;
  resultNumber: string;
  completedAt: string | Date;
  completedBy: UserEntity;
  submittedAt: string;
  resultDate: string;
  status: LabOrderStatus;
  quarterNumber: number;
}

export interface LabOrdersResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: LabOrdersContent[];
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  pageable: {
    offset: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export type LabOrdersChipCountersResponse = {
  draft: number;
  toPerform: number;
  toSubmit: number;
  pending: number;
  completed: number;
  omitted: number;
};

export interface LabOrderSubmitResponse {
  results: {
    orderId: number;
    success: boolean;
    error: {
      errorCode: string;
      errorDescription: string;
      timestamp: string;
    };
  }[];
}

export interface LabOrderForEditingResponse {
  appointmentDate: string;
  dialysisBased: boolean;
  id: string;
  labId: string;
  labName: string;
  patientId: string;
  patientName: string;
  planDate: string;
  planId: string;
  procedureId: string;
  procedureName: string;
  specimenType: LabSpecimenType;
  status: LabOrderStatus;
  type: LabTestTypes;
}

export interface LabTestPlanResponse {
  dialysisBased: boolean;
  labId: string;
  labName: string;
  labOrders: LabOrderForEditingResponse[];
  patientId: string;
  patientName: string;
  planId: string;
  procedureId: string;
  procedureName: string;
  specimenType: LabSpecimenType;
  type: LabTestTypes;
  createdAt: Date | string;
}
