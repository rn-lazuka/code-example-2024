import { LabResultTestCategories } from '@enums';

export type LabResultFieldsResponse = {
  categoryCode: LabResultTestCategories;
  ranges: {
    code: string;
    name: string;
    range: string;
    measurement: string;
    order: number;
  }[];
};
