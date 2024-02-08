import uniqid from 'uniqid';
import { HdPrescriptionForm } from '@types';
import { HdPrescriptionPrescriberSource, HdType, HDPrescriptionScheduleFrequency, DaysOfWeek } from '@enums';

export const prescriptionFixture = (data: any = {}) => {
  return {
    id: uniqid(),
    prescriptionDate: '2022-10-10T10:46:56.983Z',
    prescribedBy: {
      name: 'PrescribedByTest',
      source: HdPrescriptionPrescriberSource.External,
    },
    enteredBy: {
      id: 1,
      name: 'EnteredByTest',
    },
    enteredAt: '2022-10-10T05:46:56.983Z',
    status: 'ACTIVE',
    bloodFlow: 0,
    flow: 0,
    dryWeight: 0,
    dialyzerUseType: 'SINGLE_USE',
    dialyzerBrand: 'DialyzerBrandTest',
    surfaceArea: 0,
    calcium: 0,
    sodiumStart: 0,
    sodiumEnd: 0,
    potassium: 0,
    temperature: 0,
    anticoagulantType: 'AnticoagulantTypeTest',
    primeDose: 0,
    bolusDose: 0,
    hourlyDose: 0,
    comments: 'CommentTest',
    schedule: {
      recurrent: {
        startedAt: '2023-01-05',
        endsAt: '2023-02-27',
        duration: 240,
        frequency: HDPrescriptionScheduleFrequency.ONCE_PER_WEEK,
        daysOfWeek: DaysOfWeek.Monday,
        shift: {
          id: 7,
          shiftName: '1st',
          day: DaysOfWeek.Monday,
        },
      },
    },
    ...data,
  };
};
export const hdSchedulingFormFixture = (data: any = {}) => {
  return {
    hdType: HdType.Recurrent,
    daysOfWeek: 'MON_FRI',
    frequency: HDPrescriptionScheduleFrequency.TWICE_PER_WEEK,
    shift: {
      shiftId: 1235,
      shiftName: '1st shift',
    },
    duration: 240,
    startDate: '2022-11-11',
    endDate: '2022-11-18',
    hdSession: 3,
    ...data,
  };
};

export const hdPrescriptionFormFixture = (data: any = {}): HdPrescriptionForm => {
  return {
    shiftId: 1235,
    shiftName: '1st shift',
    daysOfWeek: 'MON_FRI',
    frequency: HDPrescriptionScheduleFrequency.TWICE_PER_WEEK,
    duration: 240,
    startedAt: new Date('2022-11-11T00:00:00.000Z'),
    endsAt: new Date('2022-11-18T00:00:00.000Z'),
    anticoagulantType: 'AnticoagulantTypeTest',
    primeDose: 0,
    bolusDose: 0,
    bloodFlow: 0,
    calcium: 0,
    comments: 'CommentTest',
    flow: 0,
    dryWeight: 0,
    dialyzerUseType: 'SINGLE_USE',
    dialyzerBrand: 'DialyzerBrandTest',
    surfaceArea: 0,
    potassium: 0,
    hourlyDose: 0,
    status: 'ACTIVE',
    sodiumStart: 0,
    sodiumEnd: 0,
    prescriptionDate: '2022-10-10T10:46:56.983Z',
    prescribedBy: {
      name: 'PrescribedByTest',
      source: HdPrescriptionPrescriberSource.External,
    },
    temperature: 0,
    ...data,
  };
};
