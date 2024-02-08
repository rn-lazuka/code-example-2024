import { SnackType } from '@enums';

export interface SnackState {
  type?: SnackType;
  message: string;
  timeout?: number | null;
}

export interface SnacksSliceState {
  snacks: SnackState[];
}
