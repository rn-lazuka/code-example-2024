import { InjectionReportsContentItem, PaginationResponse } from '@types';

export interface InjectionReportResponse extends PaginationResponse {
  content: InjectionReportsContentItem[];
}
