import { render } from '@unit-tests';
import { VaccinationsExpandableRow } from '@components/pages/PatientProfile';
import userEvent from '@testing-library/user-event';
import { UserPermissions, VaccinationStatus } from '@enums';
import { screen, waitFor } from '@testing-library/dom';
import { vaccinationFixture } from '@unit-tests/fixtures';
import { dateFormat } from '@utils/dateFormat';
import { act } from 'react-dom/test-utils';

describe('VaccinationsExpandableRow', () => {
  const vaccination = vaccinationFixture();
  const user = userEvent.setup();

  it('should render the vaccination collapsed data correctly', () => {
    render(<VaccinationsExpandableRow {...vaccination} />);
    expect(screen.getByText('VACCINES:44')).toBeInTheDocument();
    expect(screen.getByText('DOSING_SCHEDULE:BOOSTER')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getAllByText('—')).toHaveLength(2);
    expect(screen.getByText('Clinic name')).toBeInTheDocument();
    expect(screen.getByText('Test doctor, DOCTOR_SPECIALITIES:DOCTOR_IN_CHARGE')).toBeInTheDocument();
    expect(screen.getByText(dateFormat(vaccination.prescriptionDate))).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText(dateFormat(vaccination.enteredAt))).toBeInTheDocument();
    expect(screen.getByText('TestUser')).toBeInTheDocument();
    expect(screen.getByText(dateFormat(vaccination.editedAt))).toBeInTheDocument();
    expect(screen.getByText('comment')).toBeInTheDocument();
  });

  it(`should render edit button if user has permission ${UserPermissions.VaccinationModify}`, () => {
    render(<VaccinationsExpandableRow {...vaccination} />, {
      preloadedState: { user: { user: { permissions: [UserPermissions.VaccinationModify] } } },
    });
    expect(screen.getByTestId('editVaccinationButton')).toBeInTheDocument();
  });

  it(`should render edit button if user has permission ${UserPermissions.VaccinationDelete}`, () => {
    render(<VaccinationsExpandableRow {...vaccination} />, {
      preloadedState: { user: { user: { permissions: [UserPermissions.VaccinationDelete] } } },
    });
    expect(screen.getByTestId('deleteVaccinationButton')).toBeInTheDocument();
  });

  it(`delete button should be disabled if status ${VaccinationStatus.NotDone}`, () => {
    render(<VaccinationsExpandableRow {...vaccinationFixture({ status: VaccinationStatus.NotDone })} />, {
      preloadedState: {
        user: { user: { permissions: [UserPermissions.VaccinationDelete, UserPermissions.VaccinationModify] } },
      },
    });
    expect(screen.getByTestId('editVaccinationButton')).not.toBeDisabled();
    expect(screen.getByTestId('deleteVaccinationButton')).toBeDisabled();
  });

  it(`should show warning message and edit button should be disabled if status ${VaccinationStatus.Omitted}`, () => {
    render(<VaccinationsExpandableRow {...vaccinationFixture({ status: VaccinationStatus.Omitted })} />, {
      preloadedState: {
        user: { user: { permissions: [UserPermissions.VaccinationModify] } },
      },
    });
    expect(screen.getByTestId('editVaccinationButton')).toBeDisabled();
    expect(screen.getByText('tableView.vaccineHasBeenOmitted')).toBeInTheDocument();
  });

  it(`should show warning message and delete button should be disabled if status ${VaccinationStatus.AdministeredInternal}`, () => {
    render(<VaccinationsExpandableRow {...vaccinationFixture({ status: VaccinationStatus.AdministeredInternal })} />, {
      preloadedState: {
        user: { user: { permissions: [UserPermissions.VaccinationDelete] } },
      },
    });
    expect(screen.getByTestId('deleteVaccinationButton')).toBeDisabled();
    expect(screen.getByText('tableView.vaccineHasBeenAdministered')).toBeInTheDocument();
  });

  it('should open confirm modal on delete button click', async () => {
    render(<VaccinationsExpandableRow {...vaccination} />, {
      preloadedState: {
        user: { user: { permissions: UserPermissions.VaccinationDelete } },
      },
    });
    await act(() => user.click(screen.getByTestId('deleteVaccinationButton')));
    expect(screen.getByText('youWantToDeleteTheVaccine')).toBeTruthy();
    expect(screen.getByText('dataWillBeLost')).toBeTruthy();
  });

  it('should close modal after deleting the vaccination', async () => {
    render(<VaccinationsExpandableRow {...vaccination} />, {
      preloadedState: {
        user: { user: { permissions: UserPermissions.VaccinationDelete } },
      },
    });

    await act(() => user.click(screen.getByTestId('deleteVaccinationButton')));
    let confirmModalDeleteButton = screen.getByTestId('confirmModalConfirmButton');

    await act(() => user.click(confirmModalDeleteButton));
    expect(screen.queryByText('youWantToDeleteTheVaccine')).not.toBeTruthy();
  });
});
