import { AppointmentSchedule, Shift } from '@types';
import { OneDayCalendarAppointmentStatus } from '@enums';
import { prepareOneDayCalendarData, sortOneDayCalendarData } from '@utils';

const mockIsolationGroups = [
  {
    id: 1,
    name: 'Group A',
    locations: 4,
    isolations: ['A1', 'A2', 'A3', 'A4'],
  },
  {
    id: 2,
    name: 'Group B',
    locations: 3,
    isolations: ['B1', 'B2', 'B3'],
  },
  {
    id: 3,
    name: 'Group C',
    locations: 5,
    isolations: ['C1', 'C2', 'C3', 'C4', 'C5'],
  },
  {
    id: 4,
    name: 'Group D',
    locations: 2,
    isolations: ['D1', 'D2'],
  },
];

const appointmentSchedules: AppointmentSchedule[] = [
  {
    id: 1,
    patientId: 101,
    patientName: 'John Doe',
    shiftId: 1,
    startTime: '08:00',
    endTime: '08:30',
    isolationGroupId: 1,
    status: OneDayCalendarAppointmentStatus.CHECK_IN,
    duration: 30,
    hasEncounter: false,
    previousSkipped: false,
  },
  {
    id: 2,
    patientId: 102,
    patientName: 'Jane Doe',
    shiftId: 2,
    startTime: '08:30',
    endTime: '09:00',
    isolationGroupId: 1,
    status: OneDayCalendarAppointmentStatus.PRE_DIALYSIS,
    duration: 100,
    hasEncounter: false,
    previousSkipped: false,
  },
  {
    id: 3,
    patientId: 103,
    patientName: 'Tom Cruise',
    shiftId: 2,
    startTime: '09:00',
    endTime: '09:30',
    isolationGroupId: 1,
    status: OneDayCalendarAppointmentStatus.HD_READING,
    duration: 30,
    hasEncounter: false,
    previousSkipped: false,
  },
  {
    id: 4,
    patientId: 104,
    patientName: 'Jennifer Aniston',
    shiftId: 2,
    startTime: '09:30',
    endTime: '10:00',
    isolationGroupId: 2,
    status: OneDayCalendarAppointmentStatus.POST_DIALYSIS,
    duration: 30,
    hasEncounter: false,
    previousSkipped: false,
  },
  {
    id: 5,
    patientId: 105,
    patientName: 'Brad Pitt',
    shiftId: 1,
    startTime: '10:00',
    endTime: '10:30',
    isolationGroupId: 1,
    status: OneDayCalendarAppointmentStatus.COMPLETED,
    duration: 30,
    hasEncounter: false,
    previousSkipped: false,
  },
  {
    id: 6,
    patientId: 106,
    patientName: 'Angelina Jolie',
    shiftId: 1,
    startTime: '10:00',
    endTime: '10:30',
    isolationGroupId: 2,
    status: OneDayCalendarAppointmentStatus.CANCELLED,
    duration: 30,
    hasEncounter: false,
    previousSkipped: false,
  },
  {
    id: 7,
    patientId: 107,
    patientName: 'Michael Johnson',
    shiftId: 1,
    startTime: '11:00',
    endTime: '11:30',
    isolationGroupId: 2,
    status: OneDayCalendarAppointmentStatus.PRE_DIALYSIS,
    duration: 30,
    hasEncounter: false,
    previousSkipped: false,
  },
];

const shifts: Shift[] = [
  {
    id: 1,
    name: 'shift 1',
    timeStart: '08:00',
    timeEnd: '12:00',
  },
  {
    id: 2,
    name: 'shift 2',
    timeStart: '12:00',
    timeEnd: '20:00',
  },
];

describe('oneDayCalendar utils', () => {
  let preparedData;

  beforeEach(() => {
    preparedData = prepareOneDayCalendarData(appointmentSchedules, mockIsolationGroups, shifts);
  });

  it('should prepare appointments for the calendar', () => {
    expect(Object.keys(preparedData).length).toEqual(4);
    expect(preparedData['isolation_group_2'].isoKey).toEqual('iso_2');
    expect(preparedData['isolation_group_2'].isolations.length).toBeGreaterThan(0);
    expect(preparedData.isolation_group_1.slots.slot_0.shift_1.length).toBeGreaterThan(0);
  });

  it('should sort previously prepared data for the calendar', () => {
    const sortedCalendarData = sortOneDayCalendarData(preparedData, shifts, 60);
    expect(sortedCalendarData.isolation_group_1.slots.slot_0.shift_1.length).toBeGreaterThan(0);
    expect(sortedCalendarData.isolation_group_1.slots.slot_0.shift_2.length).toBeGreaterThan(0);
    expect(sortedCalendarData.isolation_group_1.slots.slot_1.shift_2.length).toBeGreaterThan(0);
  });
});
