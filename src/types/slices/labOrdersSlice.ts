import type {
  CreateIndividualLabTestPlanForm,
  FileDocument,
  LabCreationForm,
  LabOrdersFilters,
  LabOrdersFiltersErrors,
  Pagination,
  PerformLabOrderRequestParams,
} from '@types';
import { LabOrderEventPlace, LabResultTestCategories, LabTestTypes, FormType, AppointmentEventPlace } from '@enums';
import {
  CreateQuarterlyBTForm,
  LabOrdersContent,
  LabOrdersStatusFilter,
  LabTestPlanResponse,
  OmitLabTestForm,
} from '@types';

export interface LabOrdersSliceState {
  statuses: {
    isLoading: boolean;
    isSubmitting: boolean;
    isFileLoading: boolean;
  };
  labTestPlan: LabTestPlanResponse | null;
  ordersList: LabOrdersContent[];
  selectedRows: Array<number | string>;
  pagination: Pagination;
  sortBy:
    | 'id'
    | 'patientId'
    | 'patientName'
    | 'procedureName'
    | 'number'
    | 'mealStatus'
    | 'status'
    | 'sampledAt'
    | 'createdAt'
    | 'labName'
    | 'specimenType';
  sortDir: 'asc' | 'desc';
  errors: Error[];
  filters: LabOrdersFilters;
  statusFilters: LabOrdersStatusFilter[];
  filtersError: LabOrdersFiltersErrors;
}

export type ManualLabResultsTestSet = {
  categoryCode: LabResultTestCategories;
  tests: {
    code: string;
    value: string;
    isAbnormal: boolean;
  }[];
};

export type SubmitManualLabResultsPayload = {
  isEditing: boolean;
  labOrderId: number;
  submitData: {
    labResultNumber: number;
    resultDate: string | Date;
    testSets: ManualLabResultsTestSet[];
    file?: FileDocument | null;
  };
};

export type CreateLabTestPayload = {
  id?: string;
  type: LabTestTypes;
  place: LabOrderEventPlace;
  mode: FormType;
  formData: LabCreationForm | CreateIndividualLabTestPlanForm | CreateQuarterlyBTForm;
};

export type PerformLabTestPayload = {
  place: LabOrderEventPlace;
  orderId: number;
  formData: PerformLabOrderRequestParams;
};

export type SubmitLabResultFilePayload = {
  labOrderId: number;
  file: FileDocument;
};

export type DeleteLabResultPayload = {
  id: number;
};

export type RescheduleLabTestPayload = {
  date: Date;
  type: LabTestTypes;
  appointmentId: string;
  labOrderId: number;
  place: AppointmentEventPlace;
};

export type OmitLabTestPayload = Pick<RescheduleLabTestPayload, 'appointmentId' | 'labOrderId' | 'place'> &
  OmitLabTestForm;
