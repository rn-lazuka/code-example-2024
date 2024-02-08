import userEvent from '@testing-library/user-event';
import { render } from '@unit-tests';
import { TreatmentInfoModal } from '@components/pages/PatientProfile';
import { waitFor, screen } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';

describe('Modal for patient treatment information', () => {
  const user = userEvent.setup();
  const onClose = jest.fn();

  it('should render modal with form if isOpen prop is true', async () => {
    render(<TreatmentInfoModal onClose={onClose} isOpen={true} />);

    expect(screen.getByTestId('profile.treatmentInfoFullScreenModal')).toBeInTheDocument();
    expect(screen.getAllByText(/profile.treatmentInfo/i)).toHaveLength(2);
    expect(screen.getByTestId(/isPatientAmbulantRadioGroupLabel/i)).toBeTruthy();
    expect(screen.getByTestId(/personInChargeSelectInput/i)).toBeTruthy();
    expect(screen.getByTestId(/nephrologistSelectInput/i)).toBeTruthy();
    expect(screen.getByTestId(/referralInfoRadioGroupLabel/i)).toBeTruthy();
    expect(screen.getByTestId(/referralClinicTextInput/i)).toBeTruthy();
    expect(screen.getByTestId(/referralDoctorAutocompleteFreeSoloAsync/i)).toBeTruthy();
    expect(screen.getByTestId(/firstDialysisDatePicker/i)).toBeTruthy();
    expect(screen.getByTestId(/firstCenterDialysisDatePicker/i)).toBeTruthy();
    expect(screen.getByTestId(/commentsTextInput/i)).toBeTruthy();
  });

  it('should show confirm modal after changing data and press cancel', async () => {
    render(<TreatmentInfoModal isOpen={true} onClose={onClose} />);
    await act(() => user.type(screen.getByTestId(/referralClinicTextInput/i), 'something'));
    await act(() => user.click(screen.getByTestId('treatmentInfoModalCancelButton')));

    expect(screen.getByTestId('GlobalConfirmModal')).toBeInTheDocument();

    await act(() => user.click(screen.getByTestId('confirmModalCancelButton')));
    expect(screen.queryByTestId('GlobalConfirmModal')).not.toBeInTheDocument();
  });

  it('should show confirm modal after changing data and press close', async () => {
    render(<TreatmentInfoModal isOpen={true} onClose={onClose} />);
    await act(() => user.type(screen.getByTestId(/referralClinicTextInput/i), 'something'));
    await act(() => user.click(screen.getByTestId('closeModalButton')));

    expect(screen.getByTestId('GlobalConfirmModal')).toBeInTheDocument();

    await act(() => user.click(screen.getByTestId('confirmModalCloseButton')));
    expect(screen.queryByTestId('GlobalConfirmModal')).not.toBeInTheDocument();
  });

  it('should be closed on press cancel or close button', async () => {
    const onClose = jest.fn();
    render(<TreatmentInfoModal isOpen={true} onClose={onClose} />);

    const cancelBtn = screen.getByTestId('treatmentInfoModalCancelButton');
    const closeBtn = screen.getByTestId(/closeModalButton/i);

    await act(() => user.click(cancelBtn));
    await act(() => user.click(closeBtn));

    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
