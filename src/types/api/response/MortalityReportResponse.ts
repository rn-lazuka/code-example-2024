import { PaginationResponse, MortalityReportsContentItem } from '@types';

export type MortalityReportResponse = {
  content: MortalityReportsContentItem[];
} & PaginationResponse;
