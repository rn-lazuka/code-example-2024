import { AllergiesInfo } from '@enums';

export interface Allergy {
  type: AllergiesInfo;
  values: { name: string }[];
}
