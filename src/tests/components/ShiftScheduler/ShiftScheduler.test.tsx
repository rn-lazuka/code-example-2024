import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import { waitFor } from '@testing-library/react';
import { DaysOfWeek, HDPrescriptionScheduleFrequency } from '@enums';
import userEvent from '@testing-library/user-event';
import { ShiftScheduler } from '@components';
import { act } from 'react-dom/test-utils';

describe('ShiftScheduler', () => {
  const name = 'TEST';
  const user = userEvent.setup();
  const shiftName = 'SHIFT #2';
  const uniqCount = 100500;
  const errorMessage = 'test error message';

  it('should render the component with available days and shifts', () => {
    render(
      <ShiftScheduler
        name={name}
        data={[
          {
            shiftId: 100000,
            shiftName,
            dayCountResponse: [
              {
                day: DaysOfWeek.Monday,
                count: 1,
              },
              {
                day: DaysOfWeek.Tuesday,
                count: 1,
              },
              {
                day: DaysOfWeek.Wednesday,
                count: 1,
              },
              {
                day: DaysOfWeek.Thursday,
                count: 0,
              },
              {
                day: DaysOfWeek.Sunday,
                count: uniqCount,
              },
              {
                day: DaysOfWeek.Saturday,
                count: 1,
              },
            ],
          },
        ]}
        frequency={HDPrescriptionScheduleFrequency.TWICE_PER_WEEK}
        days={[DaysOfWeek.Monday, DaysOfWeek.Tuesday]}
        onChange={() => {}}
        error={errorMessage}
      />,
    );

    expect(screen.getByTestId(`shiftScheduler-${name}`)).toBeInTheDocument();
    expect(screen.getByText(shiftName)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getAllByTestId(`shiftSchedulerDay-${name}`)).toHaveLength(7);
    expect(
      [...screen.getAllByTestId(`shiftSchedulerDay-${name}`)].filter((elem) => (elem as any).disabled === true),
    ).toHaveLength(5);
    expect(screen.getByText(uniqCount)).toBeInTheDocument();
  });

  it('should render the component and process selection', async () => {
    render(
      <ShiftScheduler
        name={name}
        data={[
          {
            shiftId: 100000,
            shiftName,
            dayCountResponse: [
              {
                day: DaysOfWeek.Monday,
                count: 1,
              },
              {
                day: DaysOfWeek.Tuesday,
                count: 1,
              },
              {
                day: DaysOfWeek.Wednesday,
                count: 1,
              },
              {
                day: DaysOfWeek.Thursday,
                count: 0,
              },
              {
                day: DaysOfWeek.Sunday,
                count: uniqCount,
              },
              {
                day: DaysOfWeek.Saturday,
                count: 1,
              },
            ],
          },
          {
            shiftId: 100001,
            shiftName,
            dayCountResponse: [
              {
                day: DaysOfWeek.Monday,
                count: 1,
              },
              {
                day: DaysOfWeek.Tuesday,
                count: 1,
              },
              {
                day: DaysOfWeek.Wednesday,
                count: 1,
              },
              {
                day: DaysOfWeek.Thursday,
                count: 0,
              },
              {
                day: DaysOfWeek.Sunday,
                count: uniqCount,
              },
              {
                day: DaysOfWeek.Saturday,
                count: 1,
              },
            ],
          },
        ]}
        frequency={HDPrescriptionScheduleFrequency.TWICE_PER_WEEK}
        days={[DaysOfWeek.Monday, DaysOfWeek.Tuesday]}
        onChange={() => {}}
        error={errorMessage}
      />,
    );

    expect(screen.getByTestId(`shiftScheduler-${name}-row-${DaysOfWeek.Monday}`)).toBeInTheDocument();
    const secondShiftFirstDayButton = screen
      .getByTestId(`shiftScheduler-${name}-${DaysOfWeek.Monday}-${100001}`)
      .querySelector('button');
    expect(secondShiftFirstDayButton!.querySelector('.MuiSvgIcon-root')).toBeInTheDocument();
    expect(secondShiftFirstDayButton).toBeInTheDocument();
    await act(() => user.click(secondShiftFirstDayButton!));
    expect(secondShiftFirstDayButton!.querySelector('.MuiSvgIcon-root')).toHaveStyle('opacity: 1');
  });

  it('should render the component with default value', () => {
    render(
      <ShiftScheduler
        name={name}
        data={[
          {
            shiftId: 100000,
            shiftName,
            dayCountResponse: [
              {
                day: DaysOfWeek.Monday,
                count: 1,
              },
              {
                day: DaysOfWeek.Tuesday,
                count: 1,
              },
              {
                day: DaysOfWeek.Wednesday,
                count: 1,
              },
              {
                day: DaysOfWeek.Thursday,
                count: 0,
              },
              {
                day: DaysOfWeek.Sunday,
                count: uniqCount,
              },
              {
                day: DaysOfWeek.Saturday,
                count: 1,
              },
            ],
          },
          {
            shiftId: 100001,
            shiftName,
            dayCountResponse: [
              {
                day: DaysOfWeek.Monday,
                count: 1,
              },
              {
                day: DaysOfWeek.Tuesday,
                count: 1,
              },
              {
                day: DaysOfWeek.Wednesday,
                count: 1,
              },
              {
                day: DaysOfWeek.Thursday,
                count: 0,
              },
              {
                day: DaysOfWeek.Sunday,
                count: uniqCount,
              },
              {
                day: DaysOfWeek.Saturday,
                count: 1,
              },
            ],
          },
        ]}
        frequency={HDPrescriptionScheduleFrequency.TWICE_PER_WEEK}
        days={[DaysOfWeek.Monday, DaysOfWeek.Tuesday]}
        defaultValue={{ shiftId: 100001, days: [DaysOfWeek.Monday, DaysOfWeek.Tuesday] }}
        onChange={() => {}}
      />,
    );

    const secondShiftFirstDayButton = screen
      .getByTestId(`shiftScheduler-${name}-${DaysOfWeek.Monday}-${100001}`)
      .querySelector('button');
    expect(secondShiftFirstDayButton!.querySelector('.MuiSvgIcon-root')).toHaveStyle('opacity: 1');
  });

  it('should render the component and auto select the second shift because the first one is not available', () => {
    render(
      <ShiftScheduler
        name={name}
        data={[
          {
            shiftId: 100000,
            shiftName,
            dayCountResponse: [
              {
                day: DaysOfWeek.Monday,
                count: 0,
              },
              {
                day: DaysOfWeek.Tuesday,
                count: 0,
              },
              {
                day: DaysOfWeek.Wednesday,
                count: 0,
              },
              {
                day: DaysOfWeek.Thursday,
                count: 0,
              },
              {
                day: DaysOfWeek.Sunday,
                count: 0,
              },
              {
                day: DaysOfWeek.Saturday,
                count: 0,
              },
            ],
          },
          {
            shiftId: 100001,
            shiftName,
            dayCountResponse: [
              {
                day: DaysOfWeek.Monday,
                count: 1,
              },
              {
                day: DaysOfWeek.Tuesday,
                count: 1,
              },
              {
                day: DaysOfWeek.Wednesday,
                count: 1,
              },
              {
                day: DaysOfWeek.Thursday,
                count: 0,
              },
              {
                day: DaysOfWeek.Sunday,
                count: uniqCount,
              },
              {
                day: DaysOfWeek.Saturday,
                count: 1,
              },
            ],
          },
        ]}
        frequency={HDPrescriptionScheduleFrequency.TWICE_PER_WEEK}
        days={[DaysOfWeek.Monday, DaysOfWeek.Tuesday]}
        onChange={() => {}}
      />,
    );

    const secondShiftFirstDayButton = screen
      .getByTestId(`shiftScheduler-${name}-${DaysOfWeek.Monday}-${100001}`)
      .querySelector('button');
    expect(secondShiftFirstDayButton!.querySelector('.MuiSvgIcon-root')).toHaveStyle('opacity: 1');
  });
});
