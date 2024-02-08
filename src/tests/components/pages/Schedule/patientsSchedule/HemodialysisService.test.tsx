import { render } from '@unit-tests';
import { screen } from '@testing-library/react';
import { HemodialysisService } from '@components/pages/Schedule/patientsSchedule/components/HemodialysisService/HemodialysisService';
import { OneDayCalendarAppointmentStatus } from '@enums';
import { act } from 'react-dom/test-utils';

jest.mock('@components/BaseProgressBar/BaseProgressBar', () => ({
  BaseProgressBar: () => <div data-testid="BaseProgressBar"></div>,
}));

const props = {
  openServicesScreen: jest.fn(),
  hemodialysis: {
    duration: 120,
    endedAt: '2023-09-01T12:00:00',
    id: 1,
    startedAt: '2023-09-01T10:00:00',
    status: OneDayCalendarAppointmentStatus.COMPLETED,
    location: {
      id: '1',
      name: 'Dialysis Center',
    },
  },
  shift: {
    id: 1,
    name: 'Morning Shift',
    startTime: '08:00:00',
    endTime: '16:00:00',
  },
  icon: <div>Mock Icon</div>,
  timeLeft: 60,
};

describe('HemodialysisService', () => {
  it('should render HemodialysisService in CHECK_IN status', async () => {
    const preparedProps = {
      ...props,
      hemodialysis: { ...props.hemodialysis, status: OneDayCalendarAppointmentStatus.CHECK_IN },
    };

    await act(() => render(<HemodialysisService {...preparedProps} />));

    expect(screen.getByTestId('hemodialysisService')).toBeInTheDocument();
    expect(screen.queryByTestId('hemodialysisServiceOpenInNewIcon')).toBeInTheDocument();
    expect(screen.getByText('hdProcedure')).toBeInTheDocument();
    expect(screen.getByText('Mock Icon')).toBeInTheDocument();
    expect(screen.getByTestId('hemodialysisServiceStatusTitle')).toBeInTheDocument();
    expect(screen.getByTestId('hemodialysisServiceScheduleDate')).toBeInTheDocument();
    expect(screen.getByTestId('hemodialysisServiceDuration')).toBeInTheDocument();
    expect(screen.getByTestId('hemodialysisServiceShiftStartTimeAndName')).toBeInTheDocument();
    expect(screen.getByText('progress.waiting')).toBeInTheDocument();
  });

  it('should render HemodialysisService in PRE_DIALYSIS status', async () => {
    const preparedProps = {
      ...props,
      hemodialysis: { ...props.hemodialysis, status: OneDayCalendarAppointmentStatus.PRE_DIALYSIS },
    };

    await act(() => render(<HemodialysisService {...preparedProps} />));

    expect(screen.getByText('Mock Icon')).toBeInTheDocument();
    expect(screen.getByTestId('hemodialysisServiceStatusTitle')).toBeInTheDocument();
    expect(screen.getByTestId('hemodialysisServiceScheduleDate')).toBeInTheDocument();
    expect(screen.getByTestId('hemodialysisServiceDuration')).toBeInTheDocument();
    expect(screen.getByTestId('hemodialysisServiceShiftStartTimeAndName')).toBeInTheDocument();
    expect(screen.getByText('progress.pending')).toBeInTheDocument();
  });

  it('should render HemodialysisService in HD_READING status', async () => {
    const preparedProps = {
      ...props,
      hemodialysis: { ...props.hemodialysis, status: OneDayCalendarAppointmentStatus.HD_READING },
    };

    await act(() => render(<HemodialysisService {...preparedProps} />));

    expect(screen.getByText(preparedProps.hemodialysis.location.name)).toBeInTheDocument();
    expect(screen.getByTestId('BaseProgressBar')).toBeInTheDocument();
  });

  it('should render HemodialysisService in SERVICE_ENCOUNTERED status', async () => {
    const preparedProps = {
      ...props,
      hemodialysis: { ...props.hemodialysis, status: OneDayCalendarAppointmentStatus.SERVICE_ENCOUNTERED },
    };

    await act(() => render(<HemodialysisService {...preparedProps} />));

    expect(screen.getByText('progress.pending')).toBeInTheDocument();
  });

  it('should render HemodialysisService in COMPLETED status', async () => {
    const preparedProps = {
      ...props,
      hemodialysis: { ...props.hemodialysis, status: OneDayCalendarAppointmentStatus.COMPLETED },
    };

    await act(() => render(<HemodialysisService {...preparedProps} />));

    expect(screen.getByTestId('hemodialysisServiceCheckCircleIcon')).toBeInTheDocument();
    expect(screen.getByText('statuses.completed')).toBeInTheDocument();
  });
});
