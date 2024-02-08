import { HdReadingOfflineOperationType } from '@enums';

export interface HdProgressRecord {
  id: number | string;
  time: string | Date;
  systolicBp?: number;
  diastolicBp?: number;
  hr: string;
  ap?: string;
  vp?: number;
  tmp?: number;
  ufRate?: number;
  qb?: number;
  qd?: number;
  cumHeparin?: number;
  cumUf?: number;
  totalUf?: number;
  conductivity?: number;
  dialysateTemp?: number;
  heparinRate?: number;
  ktV?: number;
  urr?: number;
  duringHdNotes?: string;
  signedBy: string;
  signedById?: string;
  bay: string;
  createdAt: string;
}

export interface HdProgressRecordWithOperation extends HdProgressRecord {
  modifyingOperation: HdReadingOfflineOperationType;
}
