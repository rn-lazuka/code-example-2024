import { Dialyzers } from '@src/types';

export type DialyzerSliceState = {
  loading: boolean;
  submitting: boolean;
  saveSuccess: boolean;
  errors: Error | null;
  dialyzers: Dialyzers[];
};
