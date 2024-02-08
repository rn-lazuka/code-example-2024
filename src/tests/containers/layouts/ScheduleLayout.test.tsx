import { render } from '@unit-tests';
import { ScheduleLayout } from '@containers/layouts/ScheduleLayout/ScheduleLayout';
import theme from '@src/styles/theme';
import { screen } from '@testing-library/dom';

describe('ScheduleLayout', () => {
  it('should render correct background-color on main container', () => {
    render(<ScheduleLayout />);

    expect(screen.getByTestId('scheduleLayoutMainContentContainer')).toBeInTheDocument();
    expect(screen.getByTestId('scheduleLayoutMainContentContainer')).toHaveStyle(
      `background-color: ${theme.palette.background.default}`,
    );
  });

  it('should render correct background-color on header', () => {
    render(<ScheduleLayout />);

    expect(screen.getByTestId('scheduleLayoutHeader')).toBeInTheDocument();
    expect(screen.getByTestId('scheduleLayoutHeader')).toHaveStyle(
      `background-color: ${theme.palette.surface.default}`,
    );
  });

  it('should render correct title', () => {
    render(<ScheduleLayout />);

    expect(screen.getByText('allSchedule')).toBeInTheDocument();
  });
});
