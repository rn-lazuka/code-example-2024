import type { MedicationResponse } from '@types';
import { render } from '@unit-tests';
import { medicationFixture } from '@unit-tests/fixtures/medications';
import { MedicationsExpandableRow } from '@components/pages/PatientProfile';
import userEvent from '@testing-library/user-event';
import { MedicationFrequency, UserPermissions } from '@enums';
import { screen } from '@testing-library/dom';
import { DoctorTypes } from '@enums/global/Doctor';
import { act } from 'react-dom/test-utils';

describe('MedicationsExpandableRow', () => {
  const medication: MedicationResponse = medicationFixture();
  const user = userEvent.setup();

  it('should render the collapsed info with other frequency value', () => {
    render(
      <MedicationsExpandableRow
        medication={{ ...medication, frequency: { code: MedicationFrequency.OTHER, extValue: 'other frequency' } }}
        collapseAllRowsHandler={() => {}}
      />,
    );
    expect(screen.getByText('other frequency')).toBeTruthy();
  });

  it('should render the collapsed component', () => {
    render(
      <MedicationsExpandableRow
        medication={{ ...medication, frequency: undefined }}
        collapseAllRowsHandler={() => {}}
      />,
    );
    expect(screen.getByText(MedicationFrequency.EVERY_DIALYSIS)).toBeTruthy();
  });

  it('should show only the speciality if name field is empty', () => {
    render(
      <MedicationsExpandableRow
        medication={{
          ...medication,
          doctor: { source: DoctorTypes.Internal, speciality: medication.doctor.speciality },
        }}
        collapseAllRowsHandler={() => {}}
      />,
    );
    expect(screen.getByText('DOCTOR_SPECIALITIES:DOCTOR_NEPHROLOGIST')).toBeTruthy();
  });

  it('should open confirm modal on delete button click', async () => {
    render(<MedicationsExpandableRow medication={medication} collapseAllRowsHandler={() => {}} />, {
      preloadedState: {
        user: { user: { permissions: UserPermissions.MedicationDelete } },
      },
    });
    await act(() => user.click(screen.getByTestId('deleteMedicationButton')));
    expect(screen.getByText('youWantToDelete')).toBeTruthy();
  });

  it('should close modal after deleting the medication', async () => {
    render(<MedicationsExpandableRow medication={medication} collapseAllRowsHandler={() => {}} />, {
      preloadedState: {
        user: { user: { permissions: UserPermissions.MedicationDelete } },
      },
    });
    await act(() => user.click(screen.getByTestId('deleteMedicationButton')));
    let confirmModalDeleteButton = screen.getByTestId('confirmModalConfirmButton');

    await act(() => user.click(confirmModalDeleteButton));
    expect(screen.queryByText('youWantToDelete')).not.toBeTruthy();
  });
});
