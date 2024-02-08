import type {
  HospitalizationResponseContentItem,
  MortalityReportsContentItem,
  Pagination,
  VascularAccessReportsTableItem,
} from '@types';
import { PatientCensusReportContent, PatientStationHistoryReportContentItem } from '@types';

type ReportPaginationPayload = {
  pagination: Pagination;
};

export type VascularAccessReportsPayload = {
  content: VascularAccessReportsTableItem[];
} & ReportPaginationPayload;

export type MortalityReportPayload = {
  content: MortalityReportsContentItem[];
} & ReportPaginationPayload;

export type HospitalizationReportPayload = {
  content: HospitalizationResponseContentItem[];
} & ReportPaginationPayload;

export type PatientCensusReportPayload = {
  content: PatientCensusReportContent[];
} & ReportPaginationPayload;

export type PatientStationHistoryReportPayload = {
  content: PatientStationHistoryReportContentItem[];
} & ReportPaginationPayload;
