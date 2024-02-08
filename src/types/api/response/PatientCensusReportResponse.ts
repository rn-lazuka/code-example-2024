import type { PatientAddress } from '@types';
import { VirusStatus, PatientStatuses } from '@enums';
import { PaginationResponse } from '@types';

export type PatientCensusReportContent = {
  id: number;
  patientId: number;
  name: string;
  documentNumber: string;
  phone: string;
  address: PatientAddress;
  bornAt: string;
  gender: string;
  race: string;
  religion: string;
  treatmentReferral: {
    doctor: string;
    clinic: string;
  };
  clinicalInfo: {
    diagnosis: string;
    hbsag: VirusStatus;
    antiHcv: VirusStatus;
    antiHiv: VirusStatus;
  };
  status: PatientStatuses;
  previousStatus: PatientStatuses;
  modifiedAt: Date;
  createdAt: Date;
};

export type PatientCensusReportResponse = {
  content: PatientCensusReportContent[];
} & PaginationResponse;

export interface PatientCensusCountersResponse {
  infection: {
    normal: number;
    hiv: number;
    hepB: number;
    hepC: number;
  };
  therapy: {
    permanent: number;
    visiting: number;
    acute: number;
    walkIn: number;
    dead: number;
    discharged: number;
    hospitalized: number;
    temporaryTransferred: number;
  };
}
