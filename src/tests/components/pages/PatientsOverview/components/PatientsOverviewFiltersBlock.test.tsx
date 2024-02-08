import { screen } from '@testing-library/dom';
import { getTestStore, render } from '@unit-tests';
import { PatientsOverviewFiltersBlock } from '@components/pages/PatientsOverview';
import { DrawerType, PatientOverviewStatusesFilters, UserPermissions } from '@enums';
import { addDrawer, changePatientsOverviewStatusesFilters, patientsOverviewInitialState } from '@store/slices';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

describe('PatientsOverviewFiltersBlock', () => {
  const user = userEvent.setup();

  it('should render status filters without "My patients" chip', () => {
    const statusFilters = patientsOverviewInitialState.filters.statuses.items;
    const filteredStatusFilters = statusFilters.filter(
      (item) => item.name !== PatientOverviewStatusesFilters.MyPatients,
    );

    render(<PatientsOverviewFiltersBlock changeViewMode={() => {}} />);

    filteredStatusFilters.forEach((item) => {
      expect(screen.getByTestId(`${item.name}TextToggleButton`)).toBeInTheDocument();
    });
  });

  it('should render status filters with "My patients" chip', () => {
    const statusFilters = patientsOverviewInitialState.filters.statuses.items;

    render(<PatientsOverviewFiltersBlock changeViewMode={() => {}} />, {
      preloadedState: { user: { user: { permissions: [UserPermissions.PatientsSeeOwn] } } },
    });

    statusFilters.forEach((item) => {
      expect(screen.getByTestId(`${item.name}TextToggleButton`)).toBeInTheDocument();
    });
  });

  it('handles patientsFilterStatusesChangeHandler correctly', async () => {
    const dispatch = jest.fn();
    const store = getTestStore({ user: { user: { permissions: [UserPermissions.PatientsSeeOwn] } } });
    store.dispatch = dispatch;
    const statusFilters = patientsOverviewInitialState.filters.statuses.items;

    render(<PatientsOverviewFiltersBlock changeViewMode={() => {}} />, {
      store,
    } as any);

    await act(() => user.click(screen.getByTestId(`${statusFilters[3].name}TextToggleButton`)));

    expect(dispatch).toHaveBeenCalledWith({
      type: changePatientsOverviewStatusesFilters.type,
      payload: {
        items: statusFilters.map((item, index) => {
          if (index === 0) {
            return { ...item, selected: false };
          }
          if (index === 3) {
            return { ...item, selected: true };
          }
          return item;
        }),
      },
    });
  });

  it('handles openDrawer correctly', async () => {
    const dispatch = jest.fn();
    const store = getTestStore({ user: { user: { permissions: [UserPermissions.PatientsSeeOwn] } } });
    store.dispatch = dispatch;

    render(<PatientsOverviewFiltersBlock changeViewMode={() => {}} />, { store } as any);

    await act(() => user.click(screen.getByTestId('openDrawerWithOverviewPatientsFilterButton')));

    expect(dispatch).toHaveBeenCalledWith(
      addDrawer({
        type: DrawerType.PatientsOverviewFilters,
        collapsable: false,
      }),
    );
  });

  it('handles changeViewMode correctly', async () => {
    const changeViewModeMock = jest.fn();
    render(<PatientsOverviewFiltersBlock changeViewMode={changeViewModeMock} />);
    await act(() => user.click(screen.getByTestId('changeViewModeOverviewPatientsFilterButton')));
    expect(changeViewModeMock).toHaveBeenCalled();
  });

  const checkTableViewIcons = (descriptionUniqPart: string, isGridView: boolean, expectedIdName: string) => {
    it(`should render ${descriptionUniqPart}`, () => {
      render(<PatientsOverviewFiltersBlock changeViewMode={() => {}} isGridView={isGridView} />);

      expect(screen.getByTestId(expectedIdName)).toBeInTheDocument();
    });
  };

  checkTableViewIcons('grid view icon', false, 'patientsOverviewGridViewIcon');
  checkTableViewIcons('table rows icon', true, 'patientsOverviewTableRowIcon');
});
