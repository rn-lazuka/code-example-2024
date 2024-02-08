import { VirologyResponse } from '@types';

export type VirologySliceState = {
  loading: boolean;
  virologyList: VirologyResponse[];
  errors: Error[];
};
