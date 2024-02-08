import { PatientStatuses, ServiceModalName } from '@enums';
import { HdProgressRecord } from '@types';
import uniqid from 'uniqid';
import { format } from 'date-fns';
import { UserPermissions, DialysisStatus } from '@enums';
import { getTenantDate } from '@utils/getTenantDate';

export const patient = {
  id: 1,
  patientName: 'testName',
  status: PatientStatuses.Permanent,
  document: {
    type: '',
    number: 'P123',
  },
  birthDate: '2000-11-12',
  gender: {
    code: 'male',
    extValue: '',
  },
  isolationGroup: { id: 1, name: 'Iso 1' },
};

export const dialysisHdReadingRecordFixture = (data?: Partial<HdProgressRecord>): Required<HdProgressRecord> => {
  return {
    id: uniqid(),
    time: '2022-11-04T09:53:18.166Z',
    diastolicBp: 90,
    systolicBp: 120,
    hr: 'hd-test-string',
    ap: 'ap-test-string',
    vp: 51,
    tmp: 52,
    ufRate: 53,
    qb: 54,
    qd: 55,
    cumHeparin: 156,
    cumUf: 57,
    totalUf: 58,
    conductivity: 59,
    dialysateTemp: 60,
    heparinRate: 61,
    ktV: 62,
    urr: 63,
    duringHdNotes: 'duringHdNotes text content',
    signedBy: 'signedBy signedBy',
    signedById: '1',
    createdAt: '2022-11-04T09:53:18.166Z',
    bay: 'Bay 111test111',
    ...data,
  };
};

export const dialysisFixture = (
  status: DialysisStatus | null,
  hdReadingRecords: HdProgressRecord[] = [],
  withDialysis: boolean = true,
  serviceModal?: any,
) => {
  return {
    user: {
      user: { firstName: 'firstName', lastName: 'lastName', permissions: [UserPermissions.DialysisAddMeasurement] },
    },
    serviceModal: serviceModal ?? { [ServiceModalName.DialysisProcedureModal]: { appointmentId: '12', patientId: 1 } },
    dialysis: {
      loading: false,
      patient,
      date: format(getTenantDate(), 'yyyy-MM-dd'),
      status: { activeStep: status, currentStep: status },
      preHd: {
        initial: { test: 'test' },
        calculations: {},
        indicators: {},
        accessManagements: [],
        anticoagulant: {},
        dialysate: {},
        dialyzer: {},
      },
      hdReading: {
        allRecords: hdReadingRecords,
        savedRecords: hdReadingRecords,
        storage: null,
      },
      metaData: {
        event: null,
      },
      startTime: '2022-11-10T14:52:34.559',
      endTime: '2022-11-10T14:52:34.559',
      postHd: {
        weight: {
          preSessionWeight: 10,
        },
      },
      services: {
        hemodialysis: {},
        doctorReviews: [],
      },
      withDialysis: withDialysis,
    },
    dialyzer: {
      dialyzers: [],
    },
  };
};

export const dialysisVaccineAdministeringFixture = () => {
  return {
    user: {
      user: { firstName: 'firstName', lastName: 'lastName', permissions: [UserPermissions.DialysisAddMeasurement] },
    },
    serviceModal: {
      [ServiceModalName.VaccineMedicationAdministeringModal]: {
        patientId: 1,
        appointmentId: '12',
        vaccine: {
          id: 1,
          vaccineType: { name: 'COVID-19 Vaccine', code: 44 },
          dossingSchedule: 'FIRST',
        },
      },
    },
    dialysis: {
      patient,
      date: format(getTenantDate(), 'yyyy-MM-dd'),
      status: { activeStep: DialysisStatus.CheckIn, currentStep: DialysisStatus.CheckIn },
      metaData: {
        event: null,
      },
      startTime: '2022-11-10T14:52:34.559',
      endTime: '2022-11-10T14:52:34.559',
    },
  };
};
