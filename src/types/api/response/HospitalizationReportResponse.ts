import { PatientHospitalizationReason } from '@enums';
import { PaginationResponse } from '@types';

export type HospitalizationResponseContentItem = {
  id: number;
  patient: {
    id: number;
    name: string;
  };
  date: string;
  returningDate: string;
  reason: PatientHospitalizationReason;
  details: string;
  clinic: string;
  comment: string;
};

export type HospitalizationReportResponse = {
  content: HospitalizationResponseContentItem[];
} & PaginationResponse;

export type HospitalizationReportCountersResponse = {
  unknown: number;
  hdRelated: number;
  nonHdRelated: number;
  vascularRelated: number;
};
