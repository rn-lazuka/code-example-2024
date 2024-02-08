import { FileTypes, PatientDocumentType, PatientStatuses, Virus } from '@enums';
import type {
  ClinicalInfoResponse,
  DialysisProcessInfoRequest,
  TreatmentInfo,
  Injection,
  IsolationGroup,
  Dialyzers,
} from '@types';

export interface PatientEntity {
  id?: string;
  name: string;
  status?: PatientStatuses;
}

export interface PatientAddress {
  houseFlat: string;
  street: string;
  city: string;
  district?: string;
  state?: string;
  countryIso: string;
  postalCode: string | number;
}

export interface Document {
  type: PatientDocumentType;
  number: string;
}

export interface WalkInPatient extends PatientEntity {
  document: Document;
  address: PatientAddress;
  comment: string;
}

export interface PatientWithDocument extends Omit<PatientEntity, 'id'> {
  id: number;
  document: Document;
}

export interface Phone {
  countryCode: string;
  number: string;
}

export interface Kin {
  name: string;
  relationship: string;
  phone: Phone;
}

export interface VirologyStatus {
  [Virus.Hbsag]: string;
  [Virus.Hbsab]: string;
  [Virus.Anti_Hcv]: string;
  [Virus.Anti_Hiv]: string;
}

export interface FamilyInfo {
  maritalStatus: string;
  childCount: number;
  kins: Kin[];
}

export interface FileDocument {
  id: number;
  name: string;
  type: FileTypes;
  size: number;
  createAt: string;
  tempKey: string;
  error: {
    code: string;
    description: string;
    id: string;
  };
}

export interface Gender {
  code?: string;
  extValue?: string;
}

export interface Patient extends WalkInPatient {
  photoPath?: string;
  dateBirth?: string;
  gender?: Gender;
  educationLevel?: string;
  occupation?: string;
  race?: string;
  nationality?: string;
  language?: {
    code?: string;
    extValue?: string;
  };
  religion?: string;
  phone?: Phone;
  family?: FamilyInfo;
  files?: FileDocument[];
}

export interface FullPatient extends Patient {
  clinicalInfo?: ClinicalInfoResponse | null;
  treatmentInfo?: TreatmentInfo;
  dialysisProcessInfo?: DialysisProcessInfoRequest;
  dialyzersInfo?: Dialyzers[];
}

type PatientWithoutFiles = Omit<Patient, 'files'>;

export interface FormPatient extends PatientWithoutFiles {
  files: { name: string; type: string; tempKey: string }[];
  photoPath: string;
}

export interface PatientStatus {
  statusId: number;
  status: PatientStatuses;
  comment: string;
  reason: string;
  details?: string;
  createdAt: string;
  updatedAt: string;
  dateDeath?: string;
  files: FileDocument[];
  returningDate?: string;
  clinic?: string;
}

export type PatientPlannedInjection = {
  shiftId: number;
  shiftName: string;
  patientId: number;
  patientName: string;
  appointmentId: number;
  bay: string;
  photoPath: string;
  patientStatus: PatientStatus;
  isolation: IsolationGroup;
  injections: Injection[];
};
