import {
  AccessCategory,
  AccessSide,
  CvcTimeCategory,
  Instillation,
  NeedleSize,
  NeedleType,
  VascularAccessType,
} from '@enums/components';

export interface VascularAccessManagementResponse {
  accessCategory?: AccessCategory;
  side?: AccessSide;
  creationDate?: string;
  createdAtPlaceBy?: string;
  createdAtPlace?: string;
  type?: VascularAccessType;
  note?: string;
  needle?: {
    type: NeedleType;
    arterialSize: NeedleSize;
    venousSize: NeedleSize;
  };
  comments?: string;
  wasUsed?: boolean;
  id?: string;
}

export interface CvcAccessManagementResponse {
  accessCategory?: AccessCategory;
  side?: AccessSide;
  insertionDate?: string;
  category?: CvcTimeCategory;
  instillation?: {
    code?: Instillation;
    extValue?: string;
  };
  venousVolume?: string;
  arterialVolume?: string;
  comments?: string;
  wasUsed?: boolean;
  id?: string;
}

export interface AccessManagementResponse {
  accessCategory: AccessCategory;
  side: string;
  category?: string;
  insertionDate?: string;
  instillation?: {
    code: Instillation;
    extValue: string;
    arterialVolume?: string;
    venousVolume?: string;
  };
  type?: string;
  arterialNeedleSize?: string;
  createdAt?: string;
  createdBy?: string;
  creationDate?: string;
  needleType?: string;
  note?: string;
  venousNeedleSize?: string;
  comments?: string;
  arterialVolume?: string;
  venousVolume?: string;
}
