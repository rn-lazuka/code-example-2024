import { AxiosError } from 'axios';

export type BackendError = {
  id: number;
  code: string;
  description: string;
  field?: string;
};

export type FailedRequest = AxiosError<BackendError[]>;
