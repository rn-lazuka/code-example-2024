import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import { OneDayCalendarAppointmentStatus } from '@enums';
import { getAppointmentStatusIcon } from '@components/pages/Schedule/patientsSchedule/components/Appointment/utils';

describe('getAppointmentStatusIcon', () => {
  it('should return a WatchLaterIcon for CHECK_IN status', () => {
    const status = OneDayCalendarAppointmentStatus.CHECK_IN;
    render(getAppointmentStatusIcon(status));
    expect(screen.getByTestId('WatchLaterIcon')).toBeInTheDocument();
  });

  it('should return a ChangeCircleIcon for PRE_DIALYSIS status', () => {
    const status = OneDayCalendarAppointmentStatus.PRE_DIALYSIS;
    render(getAppointmentStatusIcon(status));
    expect(screen.getByTestId('ChangeCircleIcon')).toBeInTheDocument();
  });

  it('should return a PlayCircleIcon with color for HD_READING status', () => {
    const status = OneDayCalendarAppointmentStatus.HD_READING;
    render(getAppointmentStatusIcon(status));
    expect(screen.getByTestId('PlayCircleIcon')).toBeInTheDocument();
    expect(screen.getByTestId('PlayCircleIcon')).toHaveStyle('color: #1D1D00');
  });

  it('should return a StopCircleIcon with color for POST_DIALYSIS status', () => {
    const status = OneDayCalendarAppointmentStatus.POST_DIALYSIS;
    render(getAppointmentStatusIcon(status));
    expect(screen.getByTestId('StopCircleIcon')).toBeInTheDocument();
    expect(screen.getByTestId('StopCircleIcon')).toHaveStyle('color: #1D1D00');
  });

  it('should return a CheckCircleIcon for COMPLETED status', () => {
    const status = OneDayCalendarAppointmentStatus.COMPLETED;
    render(getAppointmentStatusIcon(status));
    expect(screen.getByTestId('CheckCircleIcon')).toBeInTheDocument();
  });

  it('should return a WatchLaterIcon for unknown status', () => {
    const status = 'unknown';
    render(getAppointmentStatusIcon(status));
    expect(screen.getByTestId('WatchLaterIcon')).toBeInTheDocument();
  });
});
