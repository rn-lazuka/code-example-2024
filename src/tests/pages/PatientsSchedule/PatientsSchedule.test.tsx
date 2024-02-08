import { render } from '@unit-tests';
import { ScheduleTable } from '@components/pages/Schedule/patientsSchedule/ScheduleTable';
import { Header } from '@components/pages/Schedule/patientsSchedule/components/Header/Header';
import { Table } from '@components/pages/Schedule/patientsSchedule/components/Table/Table';
import { TableRow } from '@components/pages/Schedule/patientsSchedule/components/TableRow/TableRow';
import { Appointments } from '@components/pages/Schedule/patientsSchedule/components/Appointments/Appointments';
import { Appointment } from '@components/pages/Schedule/patientsSchedule/components/Appointment/Appointment';
import { TimeLine } from '@components/pages/Schedule/patientsSchedule/components/TimeLine/TimeLine';
import { screen } from '@testing-library/dom';
import { isolationsGroup, shifts, appointments, dayTasks } from '@unit-tests/fixtures/patientsSchedule';
import { getTenantDate } from '@utils/getTenantDate';
import { prepareOneDayCalendarData, sortOneDayCalendarData } from '@utils/oneDayCalendar';
import type { AppointmentSchedule } from '@types';
import { addDays } from 'date-fns';
import { getHoursAndMinutes } from '@utils/getTimeFromDate';
import { DayTasks } from '@components/pages/Schedule/patientsSchedule/components/DayTasks/DayTasks';
import { NonHdAppointments } from '@components/pages/Schedule/patientsSchedule/components/NonHdAppointments/NonHdAppointments';

describe('PatientsSchedule', () => {
  it('should render patients schedule', () => {
    Element.prototype.scrollIntoView = jest.fn();
    render(<ScheduleTable />, {
      preloadedState: {
        patientsSchedule: {
          scheduleDate: getTenantDate(),
          shifts,
          isolationsGroup,
          appointments,
          dayTasks,
          currentDayAvailabilityShifts: [],
        },
      },
    });

    expect(screen.getByTestId('patientsScheduleTable')).toBeInTheDocument();
    expect(screen.getByTestId('scheduleHeader')).toBeInTheDocument();
    expect(screen.getByTestId('scheduleTable')).toBeInTheDocument();
  });

  it('should render schedule header', () => {
    Element.prototype.scrollIntoView = jest.fn();
    render(<Header />, {
      preloadedState: {
        patientsSchedule: {
          scheduleDate: getTenantDate(),
          shifts,
        },
      },
    });

    expect(screen.getByTestId('scheduleHeader')).toBeInTheDocument();
    expect(screen.getByText('timeline')).toBeInTheDocument();
    expect(screen.getByText('07:00 AM')).toBeInTheDocument();
    expect(screen.getByText(`${shifts[0].name}`)).toBeInTheDocument();
    expect(screen.getByText('12:00 PM')).toBeInTheDocument();
    expect(screen.getByText(`${shifts[1].name}`)).toBeInTheDocument();
    expect(screen.getByText('17:00 PM')).toBeInTheDocument();
    expect(screen.getByText(`${shifts[2].name}`)).toBeInTheDocument();
    expect(screen.getByText('22:00 PM')).toBeInTheDocument();
  });

  it('should render schedule table', () => {
    Element.prototype.scrollIntoView = jest.fn();
    render(<Table />, {
      preloadedState: {
        patientsSchedule: {
          scheduleDate: getTenantDate(),
          shifts,
          isolationsGroup,
          appointments,
          dayTasks,
          currentDayAvailabilityShifts: [],
        },
      },
    });

    expect(screen.getByTestId('scheduleTable')).toBeInTheDocument();
    expect(screen.getByTestId('globalEventDayTasksRow')).toBeInTheDocument();
    expect(screen.getByTestId('nonHdAppointmentDayTasksRow')).toBeInTheDocument();
    expect(screen.getByTestId('isoGroupHeader')).toBeInTheDocument();
    expect(screen.getByText('dayTasks')).toBeInTheDocument();
    expect(screen.getAllByTestId('isolationRow')).toHaveLength(isolationsGroup[1].locations);
    expect(screen.getAllByTestId('nonIsolationRow')).toHaveLength(isolationsGroup[0].locations);
  });

  it('should render schedule dayTasks', () => {
    render(<DayTasks events={dayTasks.events} />, {
      preloadedState: {
        patientsSchedule: {
          scheduleDate: getTenantDate(),
          shifts,
          dayTasks,
        },
      },
    });

    expect(screen.getByTestId('globalEventDayTasksRow')).toBeInTheDocument();
    expect(screen.getByText('dayTasks')).toBeInTheDocument();

    expect(screen.getAllByTestId('dayTask')).toHaveLength(dayTasks.events.length);
    expect(screen.getByText('Doctor First')).toBeInTheDocument();
    expect(screen.getByText('schedule:neph')).toBeInTheDocument();
  });

  it('should render schedule dayTask correct position', () => {
    render(<DayTasks events={dayTasks.events} />, {
      preloadedState: {
        patientsSchedule: {
          scheduleDate: getTenantDate(),
          shifts,
          dayTasks,
        },
      },
    });

    expect(screen.getByTestId('dayTask')).toHaveStyle('left: 0%; width: 60%;');
  });

  it('should render schedule NonHdAppointments', () => {
    render(<NonHdAppointments events={dayTasks.appointments} />, {
      preloadedState: {
        patientsSchedule: {
          scheduleDate: getTenantDate(),
          shifts,
          dayTasks,
        },
      },
    });

    expect(screen.getByTestId('nonHdAppointmentDayTasksRow')).toBeInTheDocument();
    expect(screen.getByText('nonHdServices')).toBeInTheDocument();

    expect(screen.getAllByTestId('dayTask')).toHaveLength(dayTasks.appointments.length);
    expect(screen.getByText('nonHdServices')).toBeInTheDocument();
  });

  it('should render schedule row', () => {
    const dataForScheduleOneDay = prepareOneDayCalendarData(
      appointments as AppointmentSchedule[],
      isolationsGroup,
      shifts,
    );
    const data = sortOneDayCalendarData(dataForScheduleOneDay, shifts, 300);

    render(
      <TableRow
        isIsoGroup={false}
        shiftCount={shifts.length}
        slotKey="slot_1"
        index={0}
        rowData={data['isolation_group_6'].slots['slot_0']}
        isoKey={data['isolation_group_6'].isoKey}
      />,
      {
        preloadedState: {
          patientsSchedule: {
            shifts,
          },
        },
      },
    );

    expect(screen.getByTestId('nonIsolationRow')).toBeInTheDocument();
    expect(
      screen.getByTestId('nonIsolationRow').querySelectorAll('[data-testid = "nonIsolationRow"] > div'),
    ).toHaveLength(shifts.length + 3);
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('Fifth Patient')).toBeInTheDocument();
    expect(screen.getByText('Fourth Patient')).toBeInTheDocument();
    expect(screen.getByText('Sixth Patient')).toBeInTheDocument();
  });

  it('should render schedule appointments slot', () => {
    const dataForScheduleOneDay = prepareOneDayCalendarData(
      appointments as AppointmentSchedule[],
      isolationsGroup,
      shifts,
    );
    const data = sortOneDayCalendarData(dataForScheduleOneDay, shifts, 300);

    render(
      <Appointments
        slotKey="slot_0"
        shift="shift_1"
        appointments={data['isolation_group_6'].slots['slot_0']['shift_7']}
        isIso={false}
      />,
      {
        preloadedState: {
          patientsSchedule: {
            scheduleDate: getTenantDate(),
            shifts,
          },
        },
      },
    );

    expect(screen.getAllByTestId('activeAppointment')).toHaveLength(2);
    expect(screen.getByText('Fifth Patient')).toBeInTheDocument();
    expect(screen.getByText('Sixth Patient')).toBeInTheDocument();
  });

  it('should render schedule appointment', () => {
    const dataForScheduleOneDay = prepareOneDayCalendarData(
      appointments as AppointmentSchedule[],
      isolationsGroup,
      shifts,
    );
    const data = sortOneDayCalendarData(dataForScheduleOneDay, shifts, 300);

    render(<Appointment appointment={data['isolation_group_6'].slots['slot_0']['shift_7'][0]} isIso={false} />, {
      preloadedState: {
        patientsSchedule: {
          scheduleDate: getTenantDate(),
          shifts,
        },
      },
    });

    expect(screen.getByTestId('activeAppointment')).toBeInTheDocument();
    expect(screen.getByText(data['isolation_group_6'].slots['slot_0']['shift_7'][0].patientName)).toBeInTheDocument();
    expect(screen.getByTestId('ChangeCircleIcon')).toBeInTheDocument();
    expect(
      screen.getByText(`${getHoursAndMinutes(data['isolation_group_6'].slots['slot_0']['shift_7'][0].duration, ':')}`),
    ).toBeInTheDocument();
  });
  it('should render timeline', () => {
    render(<TimeLine />, {
      preloadedState: {
        patientsSchedule: {
          scheduleDate: getTenantDate(),
          shifts,
        },
      },
    });

    expect(screen.getByTestId('timeline')).toBeInTheDocument();
  });

  it('should not render timeline', () => {
    render(<TimeLine />, {
      preloadedState: {
        patientsSchedule: {
          scheduleDate: addDays(getTenantDate(), 1),
          shifts,
        },
      },
    });

    expect(screen.queryByTestId('timeline')).not.toBeInTheDocument();
  });
});
