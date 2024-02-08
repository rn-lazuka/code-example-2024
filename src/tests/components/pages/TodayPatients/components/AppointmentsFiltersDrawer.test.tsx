import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import TodayPatientsDrawerFilters from '@containers/layouts/Drawer/components/TodayPatientsDrawerFilters/TodayPatientsDrawerFilters';
import { act } from 'react-dom/test-utils';

describe('TodayPatientsDrawerFilters', () => {
  const user = userEvent.setup();

  it('should check and uncheck all filters on "Clear all" click', async () => {
    render(<TodayPatientsDrawerFilters />);
    const filters = screen.getAllByTestId('patientsIsolationFilter');

    await act(() => user.click(filters[1]));
    await act(() => user.click(filters[2]));

    expect(filters[1].querySelector('input[type="checkbox"]')).toHaveProperty('checked', true);
    expect(filters[2].querySelector('input[type="checkbox"]')).toHaveProperty('checked', true);

    await act(() => user.click(screen.getByTestId('clearAppointmentsFiltersButton')));
    expect(filters[1].querySelector('input[type="checkbox"]')).not.toHaveProperty('checked', false);
    expect(filters[2].querySelector('input[type="checkbox"]')).not.toHaveProperty('checked', false);
  });
});
