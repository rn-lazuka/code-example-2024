import { InjectionStatus, InjectionType } from '@enums';

export interface InjectionEntity {
  id: number;
  name: string;
  amount: number;
}

export interface Injection extends InjectionEntity {
  type: InjectionType;
  dosage: string;
  prepared: boolean;
  status: InjectionStatus;
}
