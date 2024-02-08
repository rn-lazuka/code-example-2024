import { PatientDocumentType, PatientStatuses } from '@enums';
import { DialysisPatient } from '@types';
import type { FullPatient, Patient, PatientEntity, PatientStatus, WalkInPatient } from '@types';

export const patientEntityFixture = (data?: Partial<PatientEntity>): PatientEntity => ({
  id: '1',
  name: 'Name',
  status: PatientStatuses.Permanent,
  ...data,
});

export const patientWalkInFixture = (data?: Partial<WalkInPatient>): WalkInPatient => ({
  ...patientEntityFixture(),
  status: PatientStatuses.Walk_In,
  document: {
    type: PatientDocumentType.NRIC,
    number: '100000',
  },
  address: {
    houseFlat: 'houseFlat',
    street: 'street',
    city: 'city',
    district: 'district',
    state: 'state',
    countryIso: 'countryIso',
    postalCode: 'postalCode',
  },
  comment: 'comment',
  ...data,
});

export const patientPermanentFixture = (data?: Partial<Patient>): FullPatient => ({
  ...patientWalkInFixture(),
  status: PatientStatuses.Permanent,
  photoPath: 'photoPath',
  dateBirth: '2010-10-10',
  gender: {
    code: 'other',
    extValue: 'gender',
  },
  educationLevel: 'educationLevel',
  occupation: 'occupation',
  race: 'race',
  nationality: 'nationality',
  language: {
    code: 'other',
    extValue: 'language',
  },
  religion: 'religion',
  phone: {
    countryCode: '+48',
    number: '10101010',
  },
  family: {
    maritalStatus: 'martialStatus',
    childCount: 1,
    kins: [
      {
        name: 'Kin A',
        relationship: 'relationship',
        phone: {
          countryCode: '+48',
          number: '20202020',
        },
      },
    ],
  },
  files: [],
  ...data,
});

export const patientStatusFixture = (data?: Partial<PatientStatus>): PatientStatus => ({
  statusId: 1,
  status: PatientStatuses.Permanent,
  comment: 'comment',
  reason: 'reason',
  createdAt: '2022-10-10',
  updatedAt: '2022-10-10',
  files: [],
  returningDate: '2022-10-11',
  dateDeath: '2022-10-11',
  ...data,
});

let uniqDialysisPatientId = 0;
export const patientDialysisFixture = (data?: Partial<DialysisPatient>): DialysisPatient => {
  uniqDialysisPatientId++;

  return {
    id: uniqDialysisPatientId,
    patientName: `Patient ${uniqDialysisPatientId}`,
    status: PatientStatuses.Permanent,
    document: {
      type: 'pdf',
      number: '10000',
    },
    birthDate: '2000-10-10',
    gender: {
      code: 'male',
      extValue: '',
    },
    ...data,
  };
};
