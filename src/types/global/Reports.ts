import { Pagination } from '@types';

export type ReportsState = {
  loading: boolean;
  error: string | null;
  couldGenerateReport: boolean;
  pagination: Pagination;
};
