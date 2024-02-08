import {
  AppointmentStatus,
  DoctorReviewStatus,
  DoctorSpecialities,
  DoctorTypes,
  LabOrderStatus,
  LabTestTypes,
  PatientStatuses,
} from '../../enums';
import { TargetAudience } from '../../enums/components/TargetAudience';
import { ClinicalScheduleEventType } from '../../enums/pages/Schedule';
import { DayTasks } from '../../types';

export const shifts = [
  {
    id: 7,
    name: '1st',
    timeStart: '07:00:00',
    timeEnd: '12:00:00',
  },
  {
    id: 8,
    name: '2st',
    timeStart: '12:00:00',
    timeEnd: '17:00:00',
  },
  {
    id: 9,
    name: '3st',
    timeStart: '17:00:00',
    timeEnd: '22:00:00',
  },
];

export const isolationsGroup = [
  {
    id: 6,
    name: 'Non-infectious',
    locations: 8,
    isolations: [],
  },
  {
    id: 5,
    name: 'Iso1',
    locations: 3,
    isolations: ['HEP_B'],
  },
];

export const appointments = [
  {
    id: 8167,
    patientId: 233,
    patientName: 'First Patient',
    shiftId: 7,
    isolationGroupId: 5,
    status: 'PRE_DIALYSIS',
    duration: 240,
  },
  {
    id: 8432,
    patientId: 232,
    patientName: 'Second Patient',
    shiftId: 7,
    isolationGroupId: 5,
    status: 'CHECK_IN',
    duration: 240,
  },
  {
    id: 8111,
    patientId: 231,
    patientName: 'Third Patient',
    shiftId: 2,
    isolationGroupId: 6,
    status: 'PRE_DIALYSIS',
    duration: 240,
  },
  {
    id: 8169,
    patientId: 211,
    patientName: 'Fourth Patient',
    shiftId: 9,
    isolationGroupId: 6,
    status: 'PRE_DIALYSIS',
    duration: 240,
  },
  {
    id: 833,
    patientId: 212,
    patientName: 'Fifth Patient',
    shiftId: 7,
    isolationGroupId: 6,
    status: 'PRE_DIALYSIS',
    duration: 120,
  },
  {
    id: 8331,
    patientId: 2122,
    patientName: 'Sixth Patient',
    shiftId: 7,
    isolationGroupId: 6,
    status: 'PRE_DIALYSIS',
    duration: 120,
  },
];

export const dayTasks: DayTasks = {
  events: [
    {
      event: {
        createdAt: '2023-06-22T09:17:49.504366Z',
        createdBy: { id: '1', name: 'Test Test', photoPath: '' },
        date: '2023-06-23',
        dialysisRelated: false,
        doctor: {
          internalDoctorId: '111',
          name: 'Doctor First',
          speciality: DoctorSpecialities.DoctorNephrologist,
        },
        endTime: '16:00:00',
        id: '399',
        isAllDay: false,
        modifiedAt: '2023-06-22T09:17:49.504366Z',
        startTime: '07:00:00',
        targetAudience: TargetAudience.AllPatients,
        type: ClinicalScheduleEventType.NephrologistVisit,
        comment: 'comment',
      },
      services: [
        {
          appointmentId: '10959',
          id: '51108',
          appointmentStatus: AppointmentStatus.CheckedIn,
          patient: { id: '364', name: 'Fdqfq', status: PatientStatuses.Permanent },
          status: LabOrderStatus.TO_PERFORM,
        },
        {
          appointmentId: '10960',
          appointmentStatus: AppointmentStatus.CheckedIn,
          id: '51102',
          patient: { id: '331', name: 'SGSa GHALSDLE', status: PatientStatuses.Permanent },
          status: LabOrderStatus.TO_PERFORM,
        },
      ],
    },
  ],
  appointments: [
    {
      date: '2023-06-23',
      doctorReviews: [
        {
          doctor: {
            deleted: false,
            internalDoctorId: '14',
            name: 'Doctor First',
            source: DoctorTypes.Internal,
            speciality: DoctorSpecialities.DoctorNephrologist,
          },
          endTime: '16:00:00',
          id: 51114,
          isAllDay: false,
          startTime: '07:00:00',
          status: DoctorReviewStatus.PENDING,
        },
      ],
      id: '10958',
      labOrders: [
        {
          createdAt: '2023-06-19T14:45:17.118008Z',
          dialysisBased: false,
          id: 964,
          procedureName: 'RTD-2',
          status: LabOrderStatus.COMPLETED,
          type: LabTestTypes.Individual,
        },
      ],
      patient: {
        id: '365',
        name: 'Wefesgfe',
        patientPhotoPath: '',
      },
    },
  ],
};
