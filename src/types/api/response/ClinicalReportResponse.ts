import {
  AccessCategory,
  VascularAccessType,
  CvcTimeCategory,
  AccessSide,
  NeedleType,
  NeedleSize,
  Instillation,
} from '@enums';
import { PaginationResponse } from '@types';

export type VascularAccessReportsContent = {
  patient: {
    id: number;
    name: string;
  };
  category: AccessCategory;
  vaType: VascularAccessType;
  cvcCategory: CvcTimeCategory;
  side: AccessSide;
  vaNeedleType: NeedleType;
  vaNeedleSizeA: NeedleSize;
  vaNeedleSizeV: NeedleSize;
  cvcInstillation: Instillation;
  vaCreationDate: string;
  vaCreationPerson: string;
  vaCreatedPlace: string;
  comments: string;
};

export type VascularAccessReportsResponse = {
  content: VascularAccessReportsContent[];
} & PaginationResponse;

export type VascularAccessChipsCountersResponse = {
  avf: number;
  avg: number;
  permanent: number;
  temporary: number;
};
