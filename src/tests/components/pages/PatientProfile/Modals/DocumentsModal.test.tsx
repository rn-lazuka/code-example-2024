import userEvent from '@testing-library/user-event';
import { DocumentsModal } from '@components/pages/PatientProfile';
import { act } from 'react-dom/test-utils';
import { render } from '@unit-tests';
import { screen } from '@testing-library/dom';

const patient = {
  files: [
    {
      id: 100,
      name: 'my_photo.jpg',
      type: 'IDENTITY_DOCUMENT',
      size: 1231232102,
      createAt: '2022-09-29T06:25:39.385Z',
    },
  ],
};

describe('DocumentsModal', () => {
  const onClose = jest.fn();
  const user = userEvent.setup();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render modal if isOpen prop is true', () => {
    render(<DocumentsModal isOpen={true} onClose={onClose} />);
    expect(screen.getByTestId('profile.documentsSubmitFullScreenModal')).toBeInTheDocument();
    expect(screen.getAllByText('profile.documentsSubmit')).toHaveLength(2);
  });

  it('should be unmounted if isOpen false', () => {
    render(<DocumentsModal isOpen={false} onClose={onClose} />);

    expect(screen.queryByTestId('profile.documentsSubmitFullScreenModal')).not.toBeInTheDocument();
  });

  it('should be closed on press cancel or close button', async () => {
    render(<DocumentsModal isOpen={true} onClose={onClose} />);
    const cancelBtn = screen.getByTestId('cancelDocumentsModalButton');
    const closeBtn = screen.getByTestId('closeModalButton');

    await act(() => user.click(cancelBtn));
    await act(() => user.click(closeBtn));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('should contain inputs field', async () => {
    render(<DocumentsModal isOpen={true} onClose={onClose} />, {
      preloadedState: { patient: { patient, errors: [] } },
    });
    const identityField = screen.getByTestId('IDENTITY_DOCUMENT_FIELD');
    const virologyField = screen.getByTestId('VIROLOGY_STATUS_FIELD');
    const medicalField = screen.getByTestId('MEDICAL_REPORT_FIELD');
    const consultationField = screen.getByTestId('CONSULTATION_FIELD');
    const bloodField = screen.getByTestId('BLOOD_TEST_FIELD');
    const hdPrescriptionField = screen.getByTestId('HD_PRESCRIPTION_FIELD');
    const otherField = screen.getByTestId('OTHER_FIELD');

    expect(identityField).toBeInTheDocument();
    expect(virologyField).toBeInTheDocument();
    expect(medicalField).toBeInTheDocument();
    expect(consultationField).toBeInTheDocument();
    expect(bloodField).toBeInTheDocument();
    expect(hdPrescriptionField).toBeInTheDocument();
    expect(otherField).toBeInTheDocument();
  });

  it('should show confirm modal after changing data', async () => {
    await render(<DocumentsModal isOpen={true} onClose={onClose} />, {
      preloadedState: { patient: { patient, errors: [] } },
    });
    const deleteButtons = screen.getAllByTestId('deleteButton');

    await act(() => user.click(deleteButtons[0]));
    const fileName = screen.queryByText('my_photo.jpg');
    expect(fileName).not.toBeInTheDocument();

    await act(() => user.click(screen.getByTestId('cancelDocumentsModalButton')));
    expect(screen.getByTestId('GlobalConfirmModal')).toBeInTheDocument();
  });

  it('should close confirm modal', async () => {
    render(<DocumentsModal isOpen={true} onClose={onClose} />, {
      preloadedState: { patient: { patient, errors: [] } },
    });
    const deleteButtons = screen.getAllByTestId('deleteButton');

    await act(() => user.click(deleteButtons[0]));
    expect(screen.getByTestId('cancelDocumentsModalButton')).toBeInTheDocument();

    await act(() => user.click(screen.getByTestId('cancelDocumentsModalButton')));
    expect(screen.getByTestId('GlobalConfirmModal')).toBeInTheDocument();

    await act(() => user.click(screen.getByTestId('confirmModalCancelButton')));
    expect(Object.keys(screen.findByTestId('GlobalConfirmModal')).length).toEqual(0);

    await act(() => user.click(screen.getByTestId('cancelDocumentsModalButton')));
    await act(() => user.click(screen.getByTestId('confirmModalConfirmButton')));

    expect(screen.queryByTestId('GlobalConfirmModal')).not.toBeInTheDocument();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should disable button while form submitting', () => {
    render(<DocumentsModal isOpen={true} onClose={onClose} />, {
      preloadedState: { patient: { patient, loading: true, saveSuccess: false, errors: [] } },
    });

    expect(screen.getByTestId('saveDocumentsModalButton')).toHaveAttribute('disabled');
    expect(screen.getByTestId('progressbar')).toBeInTheDocument();
  });

  it('should call close after success submit', () => {
    render(<DocumentsModal isOpen={true} onClose={onClose} />, {
      preloadedState: { patient: { patient, loading: false, saveSuccess: true, errors: [] } },
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
