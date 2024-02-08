import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import { userFixture } from '@unit-tests/fixtures';
import { PatientClinicalNotes } from '@pages/PatientProfile/subPages/PatientClinicalNotes/PatientClinicalNotes';
import { UserPermissions } from '@enums';

const globalAddButtonId = 'globalAddButtonId';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockImplementation(() => ({ id: 1 })),
}));

describe('Clinical notes', () => {
  it('should render initial elements', () => {
    render(<PatientClinicalNotes />, {
      preloadedState: { user: { user: userFixture() } },
    });

    expect(screen.getByTestId('clinicalNotesPageHeader')).toBeInTheDocument();
    expect(screen.getByTestId('fromDatePicker')).toBeInTheDocument();
    expect(screen.getByTestId('toDatePicker')).toBeInTheDocument();
    expect(screen.getByTestId('globalAddButtonId')).toBeInTheDocument();
    expect(screen.getByText('clinicalNotes')).toBeTruthy();
  });

  it('should show "global Add button", when user have right permission', () => {
    render(<PatientClinicalNotes />, {
      preloadedState: { user: { user: userFixture() } },
    });

    expect(screen.getByTestId(globalAddButtonId)).toBeInTheDocument();
  });

  it('should not show "global Add button", when user does not have right permission', () => {
    const userFixtureWithoutRightPermission = {
      ...userFixture(),
      permissions: userFixture().permissions.filter((permission) => permission !== UserPermissions.IssueModify),
    };
    render(<PatientClinicalNotes />, {
      preloadedState: { user: { user: userFixtureWithoutRightPermission } },
    });

    expect(screen.queryByTestId(globalAddButtonId)).not.toBeInTheDocument();
  });
});
