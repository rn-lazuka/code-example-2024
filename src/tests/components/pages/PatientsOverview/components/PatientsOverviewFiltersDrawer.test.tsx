import PatientsOverviewDrawerFilters from '@containers/layouts/Drawer/components/PatientsOverviewDrawerFilters/PatientsOverviewDrawerFilters';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { render } from '@unit-tests';
import { act } from 'react-dom/test-utils';

const patientsIsolationFilterId = 'patientsIsolationFilter';

describe('PatientsOverviewFiltersDrawer', () => {
  const user = userEvent.setup();

  it('should render isolation filters', () => {
    render(<PatientsOverviewDrawerFilters />);
    expect(screen.getByText(`filter.isolation`)).toBeTruthy();
    expect(screen.getAllByTestId(patientsIsolationFilterId)).toHaveLength(4);
  });

  it('should mark filter as checked, when click on it', async () => {
    render(<PatientsOverviewDrawerFilters />);
    const filters = screen.getAllByTestId(patientsIsolationFilterId);

    await act(() => user.click(filters[1]));

    expect(filters[1].querySelector('input[type="checkbox"]')).toHaveProperty('checked', true);
  });

  it('should uncheck all filters on "Clear all" click', async () => {
    render(<PatientsOverviewDrawerFilters />);
    const filters = screen.getAllByTestId(patientsIsolationFilterId);

    await act(() => user.click(filters[0]));
    await act(() => user.click(filters[2]));
    expect(filters[0].querySelector('input[type="checkbox"]')).toHaveProperty('checked', true);
    expect(filters[2].querySelector('input[type="checkbox"]')).toHaveProperty('checked', true);

    await act(() => user.click(screen.getByTestId('clearPatientsOverviewFiltersButton')));
    expect(filters[0].querySelector('input[type="checkbox"]')).not.toHaveProperty('checked', false);
    expect(filters[2].querySelector('input[type="checkbox"]')).not.toHaveProperty('checked', false);
  });
});
