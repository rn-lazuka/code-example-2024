import { ServiceModalName } from '@enums';

export interface ServiceModal {
  modalName: string | null;
  modalPayload: any;
}

export type ServiceModalSliceState = {
  [key in ServiceModalName]?: ServiceModal;
};
