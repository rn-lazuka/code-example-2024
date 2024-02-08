import { render } from '@unit-tests';
import { screen, waitFor } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';
import { addHocServicesModalFixture } from '@unit-tests/fixtures/addHocServicesModal';
import { AddServiceModalPlace, AddHocEventTypes, LabSpecimenType, UserPermissions } from '@enums';
import { format } from 'date-fns';
import userEvent from '@testing-library/user-event';
import { API, getTenantDate } from '@utils';

describe('AddHocServicesModal', () => {
  const user = userEvent.setup();

  it('should render addHocServicesModal', async () => {
    await act(() =>
      render(<></>, {
        preloadedState: {
          serviceModal: addHocServicesModalFixture(),
        },
      }),
    );

    expect(screen.getByTestId('addHocServicesModal')).toBeInTheDocument();
  });

  it('should disable labTest form', async () => {
    await act(() =>
      render(<></>, {
        preloadedState: {
          serviceModal: addHocServicesModalFixture({
            place: AddServiceModalPlace.SHIFT,
          }),
          user: {
            user: {
              permissions: [UserPermissions.AnalysesModifyOrder],
            },
          },
        },
      }),
    );

    expect(screen.getByLabelText('URGENT_LAB_ORDERRadioButton')).toHaveAttribute('disabled');
  });

  it('should render prefilled HD form', async () => {
    await act(() =>
      render(<></>, {
        preloadedState: {
          serviceModal: addHocServicesModalFixture({
            type: AddHocEventTypes.HD,
            patient: { label: 'Name', value: 123 },
            place: AddServiceModalPlace.SHIFT,
          }),
        },
      }),
    );

    await waitFor(() => {
      expect(screen.getByTestId('addHocServicesModal')).toBeInTheDocument();
      expect(screen.getByTestId('draggablePaper')).toBeInTheDocument();
      expect(screen.getByText('addHocEventForm.addService')).toBeInTheDocument();
      expect(screen.getByLabelText('HEMODIALYSISRadioButton')).toHaveAttribute('checked');
      expect(screen.getByLabelText('URGENT_LAB_ORDERRadioButton')).toHaveAttribute('disabled');
      expect(screen.getByTestId('patientAutocomplete')).toHaveAttribute('value', 'Name');
      expect(screen.getByTestId('dateDatePicker')).toHaveAttribute('value', '');
      expect(screen.getByTestId('shiftSelectInput')).toHaveAttribute('value', '');
      expect(screen.getByText('addHocEventForm.activeHdPrescriptionWillBeUsed')).toBeInTheDocument();
      expect(screen.getByTestId('showHDParamsButton')).toBeInTheDocument();
      expect(screen.getByTestId('addHocServicesModalCancelButton')).toBeInTheDocument();
      expect(screen.getByTestId('addHocServicesModalSaveButton')).toBeInTheDocument();
    });
  });

  it('should render prefilled labTest form', async () => {
    await act(() =>
      render(<></>, {
        preloadedState: {
          serviceModal: addHocServicesModalFixture({
            type: AddHocEventTypes.LAB_TEST,
            labTestPatient: { label: 'Name', value: 123 },
            place: AddServiceModalPlace.GLOBAL,
            procedure: { label: 'RTD-1', value: 123 },
            laboratory: { label: 'Lab Emulator', value: 123 },
          }),
          user: {
            user: {
              permissions: [UserPermissions.AnalysesModifyOrder],
            },
          },
        },
      }),
    );

    await waitFor(() => {
      expect(screen.getByTestId('addHocServicesModal')).toBeInTheDocument();
      expect(screen.getByTestId('draggablePaper')).toBeInTheDocument();
      expect(screen.getByText('addHocEventForm.addService')).toBeInTheDocument();
      expect(screen.getByLabelText('HEMODIALYSISRadioButton')).not.toHaveAttribute('checked');
      expect(screen.getByLabelText('URGENT_LAB_ORDERRadioButton')).not.toHaveAttribute('disabled');
      expect(screen.getByTestId('labTestPatientAutocomplete')).toHaveAttribute('value', 'Name');
      expect(screen.getByTestId('procedureFormAutocomplete')).toHaveAttribute('value', 'RTD-1');
      expect(screen.getByTestId('laboratoryFormAutocomplete')).toHaveAttribute('value', '');
      expect(screen.getByTestId('specimenTypeSelectInput')).toHaveAttribute('value', LabSpecimenType.BLOOD);
      expect(screen.getByTestId('dateDatePicker')).toHaveAttribute('value', format(getTenantDate(), 'dd/MM/yyyy'));
      expect(screen.getByTestId('addHocServicesModalCancelButton')).toBeInTheDocument();
      expect(screen.getByTestId('addHocServicesModalSaveButton')).toBeInTheDocument();
    });
  });

  it('should not render form', async () => {
    await act(() =>
      render(<></>, {
        preloadedState: {
          serviceModal: addHocServicesModalFixture({
            type: null,
          }),
        },
      }),
    );

    await waitFor(() => {
      expect(screen.queryByTestId('patientAutocomplete')).not.toBeInTheDocument();
      expect(screen.queryByTestId('labTestPatientAutocomplete')).not.toBeInTheDocument();
      expect(screen.queryByTestId('dateDatePicker')).not.toBeInTheDocument();
    });
  });

  it('should close form', async () => {
    await act(() =>
      render(<></>, {
        preloadedState: {
          serviceModal: addHocServicesModalFixture(),
        },
      }),
    );

    await waitFor(async () => {
      const cancelButton = screen.queryByTestId('closeIcon');
      await act(() => user.click(cancelButton!));

      expect(screen.queryByTestId('addHocServicesModal')).not.toBeInTheDocument();
    });
  });

  it('should request availability', async () => {
    API.post = jest.fn().mockResolvedValue({
      data: [
        {
          date: '2023-05-28',
          shifts: [
            { id: 8, name: '2nd' },
            { id: 7, name: '1st' },
            { id: 9, name: '3rd' },
          ],
        },
      ],
    });
    await act(() =>
      render(<></>, {
        preloadedState: {
          serviceModal: addHocServicesModalFixture({
            patient: { label: 'Abigile', value: 237 },
          }),
        },
      }),
    );

    await waitFor(async () => {
      expect(API.post).toHaveBeenCalledWith('/pm/appointments/schedules/available', { patientId: 237 });
    });
  });
});
