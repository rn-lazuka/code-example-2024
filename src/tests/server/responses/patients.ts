import { AllergiesInfo, DoctorTypes, PatientHospitalizationReason, PatientStatuses, DialysisStatus } from '@enums';
import type { TreatmentInfo, ClinicalInfoResponse } from '@types';
import { ChangeTreatmentInfoPayload } from '@store/slices';

export const defaultChangeTreatmentResponse: ChangeTreatmentInfoPayload = {
  id: '1',
  treatmentInfo: {
    isAmbulant: true,
    personInChargeId: 1,
    nephrologistId: 1,
    referralInfo: {
      status: true,
      clinic: 'clinic',
      doctor: {
        source: DoctorTypes.Internal,
        internalDoctorId: 1,
        name: 'Doctor',
        speciality: 1,
      },
    },
    firstDialysis: 'firstDialysis',
    firstCenterDialysis: 'firstCenterDialysis',
    comments: 'comments',
    primaryNurseId: 1,
  },
};

export const defaultClinicalInfoResponse: ClinicalInfoResponse = {
  allergy: {
    type: AllergiesInfo.Allergy,
    values: [{ name: 'allergy name' }],
  },
};

export const defaultPatientsStatusesAvailableResponse = [
  PatientStatuses.Visiting,
  PatientStatuses.Walk_In,
  PatientStatuses.Temporary_Transferred,
  PatientStatuses.Hospitalized,
  PatientStatuses.Discharged,
  PatientStatuses.Dead,
];

export const defaultPatientsAppointmentsSummaryResponse = {
  appointmentId: 1234,
  dialysisId: 5678,
  status: DialysisStatus.Completed,
  startTime: '2022-03-08T09:00:00.000Z',
  endTime: '2022-03-08T11:00:00.000Z',
  bay: 'Bay 1',
  patient: {
    patientName: 'John Smith',
    gender: {
      code: 'M',
      extValue: 'Male',
    },
    document: {
      type: 'ID',
      number: '123456789',
    },
    birthDate: '1980-01-01',
  },
};

export const defaultPatientsStatusesResponse = [
  {
    statusId: 1,
    status: PatientStatuses.Hospitalized,
    comment: 'comment',
    reason: PatientHospitalizationReason.UNKNOWN,
    createdAt: '2022-10-10',
    updatedAt: '2022-10-10',
    files: [],
    returningDate: '2022-10-10',
    hospitalClinic: '',
  },
];

export const defaultTreatmentInfoResponse: TreatmentInfo = {
  isAmbulant: true,
  personInCharge: {
    id: '123',
    name: 'John Doe',
    specialities: [
      { id: 1, name: 'Nephrology' },
      { id: 2, name: 'Internal Medicine' },
    ],
  },
  nephrologist: {
    id: '456',
    name: 'Jane Smith',
    specialities: [{ id: 1, name: 'Nephrology' }],
  },
  referralInfo: {
    status: true,
    clinic: 'ABC Medical Center',
    doctor: {
      source: DoctorTypes.Internal,
      internalDoctorId: 1,
      name: 'Doctor',
      speciality: 1,
    },
  },
  firstDialysis: '2023-03-08T09:00:00Z',
  firstCenterDialysis: 'XYZ Dialysis Center',
  comments: 'Patient is allergic to penicillin',
  primaryNurse: { id: 1, name: 'Test Nurse', deleted: false },
};
