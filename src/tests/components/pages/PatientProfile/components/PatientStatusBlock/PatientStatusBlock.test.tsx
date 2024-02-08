import { screen } from '@testing-library/react';
import { PatientStatuses } from '@enums';
import { PatientStatusBlock } from '@components/pages/PatientProfile/PatientStatusBlock/PatientStatusBlock';
import { patientPermanentFixture, patientStatusFixture } from '@unit-tests/fixtures';
import { render } from '@unit-tests';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

const patient = patientPermanentFixture();
const statusesHistory = [
  patientStatusFixture({ statusId: 1, status: PatientStatuses.Permanent }),
  patientStatusFixture({ statusId: 2, status: PatientStatuses.Hospitalized }),
  patientStatusFixture({ statusId: 2, status: PatientStatuses.Visiting }),
  patientStatusFixture({ statusId: 3, status: PatientStatuses.Dead }),
];

describe('PatientStatusBlock', () => {
  const user = userEvent.setup();

  it('should render component with many statuses', async () => {
    render(<PatientStatusBlock />, {
      preloadedState: {
        patient: {
          loading: false,
          error: null,
          saveSuccess: false,
          patient,
          patientIsolation: undefined,
          statusesHistory,
        },
      },
    });

    expect(screen.getByTestId('patientStatusCollapse')).toBeInTheDocument();
    statusesHistory.forEach((statusData) => {
      expect(screen.getByTestId(`patientStatusData${statusData.status}`)).toBeInTheDocument();
    });
    expect(screen.getByText('showMore')).toBeInTheDocument();

    await act(() => user.click(screen.getByText('showMore')));
    expect(screen.getByText('showLess')).toBeInTheDocument();

    await act(() => user.click(screen.getByText('showLess')));
    expect(screen.getByText('showMore')).toBeInTheDocument();
    expect(screen.getByText('dateOfDeath')).toBeInTheDocument();
  });

  it('should render component with single status', async () => {
    render(<PatientStatusBlock />, {
      preloadedState: {
        patient: {
          loading: false,
          error: null,
          saveSuccess: false,
          patient,
          patientIsolation: undefined,
          statusesHistory: statusesHistory[0],
        },
      },
    });

    expect(screen.queryByTestId('patientStatusCollapse')).not.toBeInTheDocument();
  });
});
