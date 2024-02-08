import {
  AccessCategory,
  Instillation,
  CvcTimeCategory,
  AccessSide,
  VascularAccessType,
  NeedleSize,
  NeedleType,
} from '@enums';

export interface CVCAccessManagementForm {
  accessCategory: AccessCategory;
  insertionDate?: string | Date | null;
  instillation?: Instillation;
  instillationExtValue?: string;
  cvcCategory?: CvcTimeCategory;
  comments: string;
  side: AccessSide;
  arterialVolume?: number | string;
  venousVolume?: number | string;
}

export interface VascularAccessManagementForm {
  accessCategory: AccessCategory;
  creationDate?: string | Date | null;
  createdBy?: string;
  createdAt?: string;
  accessType?: VascularAccessType;
  note?: string;
  side: AccessSide;
  needleType?: NeedleType;
  arterialNeedleSize?: NeedleSize;
  venousNeedleSize?: NeedleSize;
  comments: string;
}
