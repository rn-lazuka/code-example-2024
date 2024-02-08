import { render } from '@unit-tests';
import { screen } from '@testing-library/dom';
import { ClinicalScheduleFilters } from '@components/pages/Schedule/clinicalSchedule/components/Filters/ClinicalScheduleFilters';
import { ClinicalScheduleEventType } from '@enums';
import { clinicalScheduleInitialState } from '@store';
import theme from '@src/styles/theme';

describe('ClinicalScheduleFilters', () => {
  it('should correctly display label and color of chip filters', () => {
    render(<ClinicalScheduleFilters />);

    expect(screen.getByText(`filters.${ClinicalScheduleEventType.PICVisit}`)).toBeInTheDocument();
    expect(screen.getByTestId(`${ClinicalScheduleEventType.PICVisit}ClinicalScheduleFilterColoredCircle`)).toHaveStyle({
      'background-color': '#F05674',
    });
    expect(screen.getByText(`filters.${ClinicalScheduleEventType.CustomEvent}`)).toBeInTheDocument();
    expect(
      screen.getByTestId(`${ClinicalScheduleEventType.CustomEvent}ClinicalScheduleFilterColoredCircle`),
    ).toHaveStyle({
      'background-color': '#006398',
    });
    expect(screen.getByText(`filters.${ClinicalScheduleEventType.QuarterlyBloodTest}`)).toBeInTheDocument();
    expect(
      screen.getByTestId(`${ClinicalScheduleEventType.QuarterlyBloodTest}ClinicalScheduleFilterColoredCircle`),
    ).toHaveStyle({
      'background-color': '#BA1A1A',
    });
    expect(screen.getByText(`filters.${ClinicalScheduleEventType.NephrologistVisit}`)).toBeInTheDocument();
    expect(
      screen.getByTestId(`${ClinicalScheduleEventType.NephrologistVisit}ClinicalScheduleFilterColoredCircle`),
    ).toHaveStyle({
      'background-color': '#00AEA9',
    });
  });

  it('should render "Clear All" chip, when 2 chip filters are selected, and applied to selected chips correct styles', () => {
    render(<ClinicalScheduleFilters />, {
      preloadedState: {
        clinicalSchedule: {
          filters: clinicalScheduleInitialState.filters.map((filter) => {
            if (
              filter.name === ClinicalScheduleEventType.PICVisit ||
              filter.name === ClinicalScheduleEventType.NephrologistVisit
            ) {
              return { ...filter, selected: true };
            }
            return filter;
          }),
        },
      },
    });

    expect(screen.getByTestId('ClinicalScheduleClearAllChip')).toBeInTheDocument();
    expect(screen.getByTestId(`${ClinicalScheduleEventType.PICVisit}ScheduleFilter`)).toHaveStyle({
      'background-color': theme.palette.primary.light,
    });
    expect(screen.getByTestId(`${ClinicalScheduleEventType.NephrologistVisit}ScheduleFilter`)).toHaveStyle({
      'background-color': theme.palette.primary.light,
    });
  });

  it('should render "Clear All" chip, when more than 2 chip filters are selected, and applied to selected chips correct styles', () => {
    render(<ClinicalScheduleFilters />, {
      preloadedState: {
        clinicalSchedule: {
          filters: clinicalScheduleInitialState.filters.map((filter) => {
            if (
              filter.name === ClinicalScheduleEventType.PICVisit ||
              filter.name === ClinicalScheduleEventType.NephrologistVisit ||
              filter.name === ClinicalScheduleEventType.CustomEvent
            ) {
              return { ...filter, selected: true };
            }
            return filter;
          }),
        },
      },
    });

    expect(screen.getByTestId('ClinicalScheduleClearAllChip')).toBeInTheDocument();
    expect(screen.getByTestId(`${ClinicalScheduleEventType.PICVisit}ScheduleFilter`)).toHaveStyle({
      'background-color': theme.palette.primary.light,
    });
    expect(screen.getByTestId(`${ClinicalScheduleEventType.NephrologistVisit}ScheduleFilter`)).toHaveStyle({
      'background-color': theme.palette.primary.light,
    });
    expect(screen.getByTestId(`${ClinicalScheduleEventType.CustomEvent}ScheduleFilter`)).toHaveStyle({
      'background-color': theme.palette.primary.light,
    });
  });

  it('should not render "Clear All" chip, when less than 2 chip filters are selected', () => {
    render(<ClinicalScheduleFilters />, {
      preloadedState: {
        clinicalSchedule: {
          filters: clinicalScheduleInitialState.filters.map((filter) => {
            if (filter.name === ClinicalScheduleEventType.PICVisit) {
              return { ...filter, selected: true };
            }
            return filter;
          }),
        },
      },
    });

    expect(screen.queryByTestId('ClinicalScheduleClearAllChip')).not.toBeInTheDocument();
    expect(screen.getByTestId(`${ClinicalScheduleEventType.PICVisit}ScheduleFilter`)).toHaveStyle({
      'background-color': theme.palette.primary.light,
    });
  });
});
