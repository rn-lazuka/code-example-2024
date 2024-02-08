import { DialysisMachineFull, DialysisMachine } from '@types';

export type DialysisMachinesSearchResponse = {
  content: DialysisMachine[];
  totalElements: number;
};

export type DialysisMachinesCreationResponse = DialysisMachineFull;

export type DialysisMachinesEditingResponse = DialysisMachineFull;
