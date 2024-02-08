import { PaginationResponse } from '@types';
import { PatientStatuses } from '@enums';

export enum PatientHistoryStationIsolations {
  HEP_B = 'HEP_B',
  HEP_C = 'HEP_C',
  HIV = 'HIV',
}

export type PatientStationHistoryReportContentItem = {
  id: number;
  patient: {
    id: number;
    name: string;
    status: PatientStatuses;
  };
  dialysisDate: string;
  startTime: string;
  endTime: string;
  location: {
    id: number;
    name: string;
  };
  isolation: {
    id: number;
    name: string;
    isolations: PatientHistoryStationIsolations[];
  };
  device: {
    id: number;
    name: string;
    serialNumber: string;
  };
};

export type PatientStationHistoryReportResponse = {
  content: PatientStationHistoryReportContentItem[];
} & PaginationResponse;
