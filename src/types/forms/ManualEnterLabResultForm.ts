import { LabResultTestCategories, FileTypes } from '@enums';
import { FileDocument } from '@types';

export type ManualEnterLabResultFileType = FileDocument & { type: FileTypes };

export type ManualEnterLabResultForm = {
  resultDate: string | Date;
  labResultNumber: number;
  tests: { name: string; value: string; category: LabResultTestCategories }[];
  checkboxes: { name: string; value: boolean; category: LabResultTestCategories }[];
  file?: ManualEnterLabResultFileType[];
};

export type ManualEnterLabResultTestSetItem = { name: string; value: string; isAbnormal: boolean };
