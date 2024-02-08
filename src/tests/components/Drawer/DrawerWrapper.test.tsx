import { act } from 'react-dom/test-utils';
import { render } from '@unit-tests';
import { DrawerWrapper } from '@containers/layouts/Drawer/DrawerWrapper';
import { DrawerType } from '@enums';
import {
  getDrawerAccessManagementFixture,
  getDrawerClinicalNotesFormFixture,
  getDrawerEmptyFixture,
  getDrawerHdPrescriptionFormFixture,
  getDrawerHdSchedulingFixture,
  getDrawerMedicationFixture,
  getDrawerPatientsOverviewFiltersFixture,
  getDrawerTodayPatientsFiltersFixture,
} from '@unit-tests/fixtures/drawers';
import { MedicationDrawerType } from '@enums';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/test',
  }),
}));

describe('DrawerWrapper', () => {
  const user = userEvent.setup();

  it('should render hd prescription form in drawer', () => {
    render(<DrawerWrapper />, {
      preloadedState: {
        drawer: {
          [DrawerType.HdPrescriptionForm]: getDrawerHdPrescriptionFormFixture(),
        },
      },
    });
    expect(screen.queryAllByTestId('drawer')).toHaveLength(1);
    expect(screen.queryByText('hdPrescription:form.title')).toBeInTheDocument();
  });

  it('should render empty drawer', () => {
    render(<DrawerWrapper />, {
      preloadedState: {
        drawer: {
          [DrawerType.Empty]: getDrawerEmptyFixture(),
        },
      },
    });
    expect(screen.queryAllByTestId('drawer')).toHaveLength(1);
  });

  it('should render medication change form in drawer', () => {
    render(<DrawerWrapper />, {
      preloadedState: {
        drawer: {
          [DrawerType.Medication]: getDrawerMedicationFixture({
            payload: {
              id: 50,
              type: MedicationDrawerType.Change,
            },
          }),
        },
      },
    });
    expect(screen.queryAllByTestId('drawer')).toHaveLength(1);
    expect(screen.queryByText('medications:form.changeTitle')).toBeInTheDocument();
  });

  it('should render medication confirm form in drawer', () => {
    render(<DrawerWrapper />, {
      preloadedState: {
        drawer: {
          [DrawerType.Medication]: getDrawerMedicationFixture({
            payload: {
              id: 50,
              type: MedicationDrawerType.Confirm,
            },
          }),
        },
      },
    });
    expect(screen.queryAllByTestId('drawer')).toHaveLength(1);
    expect(screen.queryByText('medications:form.confirmTitle')).toBeInTheDocument();
  });

  it('should render medication edit form in drawer', () => {
    render(<DrawerWrapper />, {
      preloadedState: {
        drawer: {
          [DrawerType.Medication]: getDrawerMedicationFixture({
            payload: {
              id: 50,
              type: MedicationDrawerType.Edit,
            },
          }),
        },
      },
    });
    expect(screen.queryAllByTestId('drawer')).toHaveLength(1);
    expect(screen.queryByText('medications:form.editTitle')).toBeInTheDocument();
  });

  it('should render medication add form in drawer', () => {
    render(<DrawerWrapper />, {
      preloadedState: {
        drawer: {
          [DrawerType.Medication]: getDrawerMedicationFixture(),
        },
      },
    });
    expect(screen.queryAllByTestId('drawer')).toHaveLength(1);
    expect(screen.queryByText('medications:form.title')).toBeInTheDocument();
  });

  it('should render today patients filters in drawer', () => {
    render(<DrawerWrapper />, {
      preloadedState: {
        drawer: {
          [DrawerType.TodayPatientsFilters]: getDrawerTodayPatientsFiltersFixture(),
        },
      },
    });
    expect(screen.queryAllByTestId('drawer')).toHaveLength(1);
    expect(screen.queryByText('common:filters')).toBeInTheDocument();
  });

  it('should render patients overview filters in drawer', () => {
    render(<DrawerWrapper />, {
      preloadedState: {
        drawer: {
          [DrawerType.PatientsOverviewFilters]: getDrawerPatientsOverviewFiltersFixture(),
        },
      },
    });
    expect(screen.queryAllByTestId('drawer')).toHaveLength(1);
    expect(screen.queryByText('common:filters')).toBeInTheDocument();
  });

  it('should render clinical notes form in drawer', () => {
    render(<DrawerWrapper />, {
      preloadedState: {
        drawer: {
          [DrawerType.ClinicalNotesForm]: getDrawerClinicalNotesFormFixture(),
        },
      },
    });
    expect(screen.queryAllByTestId('drawer')).toHaveLength(1);
    expect(screen.queryByText('clinicalNotes:clinicalNote')).toBeInTheDocument();
  });

  it('should render access management form in drawer', () => {
    render(<DrawerWrapper />, {
      preloadedState: {
        drawer: {
          [DrawerType.AccessManagementForm]: getDrawerAccessManagementFixture(),
        },
      },
    });
    expect(screen.queryAllByTestId('drawer')).toHaveLength(1);
    expect(screen.queryByText('accessManagement:accessManagement')).toBeInTheDocument();
  });

  it('should render hd scheduling form in drawer', () => {
    render(<DrawerWrapper />, {
      preloadedState: {
        drawer: {
          [DrawerType.HdScheduling]: getDrawerHdSchedulingFixture(),
        },
      },
    });
    expect(screen.queryAllByTestId('drawer')).toHaveLength(1);
    expect(screen.queryByText('hdPrescription:form.hdScheduling')).toBeInTheDocument();
  });

  it('should render several drawers and remove one on close click in drawer', async () => {
    const { rerender } = render(<DrawerWrapper />, {
      preloadedState: {
        drawer: {
          [DrawerType.Empty]: getDrawerEmptyFixture(),
          [DrawerType.AccessManagementForm]: getDrawerAccessManagementFixture(),
        },
      },
    });
    expect(screen.queryAllByTestId('drawer')).toHaveLength(2);
    await act(() => user.click(screen.getAllByTestId('drawerCloseIcon')[0]));
    rerender(<DrawerWrapper />);
    expect(screen.getAllByTestId('drawer')[0].querySelector('.MuiDrawer-paper')).toHaveStyle('right: -100vw');
  });
});
