import { TemporaryFileResponse } from '@types';
import { FileTypes, PatientDocumentType } from '@enums';

interface Kin {
  name: string;
  relationship: string;
  phone: {
    number: string;
    countryCode: string;
  };
}

export interface MainInfoForm {
  name: string;
  documentType: PatientDocumentType;
  documentNumber: string;
  houseFlat: string;
  street: string;
  city: string;
  district: string;
  state: string;
  countryIso: string;
  postalCode: string | number;
  comment: string;
  dateBirth: Date | null | string;
  genderCode: string;
  genderExtValue: string;
  educationLevel: string;
  occupation: { label: string; value: string } | null;
  race: string;
  nationality: { label: string; value: string };
  languageCode: string;
  languageExtValue: string;
  religion: string;
  phoneNumber: string;
  phoneCountryCode: string;
}

export interface FamilyForm {
  maritalStatus: string;
  childCount: number;
  kins: Kin[];
}

export interface FormFile extends TemporaryFileResponse {
  type: FileTypes;
  id: string | number;
  size: number;
}

export interface FormFiles {
  [FileTypes.IdentityDocument]: FormFile[];
  [FileTypes.VirologyStatus]: FormFile[];
  [FileTypes.MedicalReport]: FormFile[];
  [FileTypes.Consultation]: FormFile[];
  [FileTypes.BloodTest]: FormFile[];
  [FileTypes.HdPrescription]: FormFile[];
  [FileTypes.Other]: FormFile[];
}

export interface RegisterPatientForm extends MainInfoForm, FamilyForm, FormFiles {}
