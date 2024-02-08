import { render } from '@unit-tests';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { DiscontinueMedicationModal } from '@components/pages/PatientProfile/modals/DiscontinueMedicationModal';
import { medicationServicesFixture } from '@unit-tests/fixtures/medicationServices';
import { format } from 'date-fns';
import { act } from 'react-dom/test-utils';

describe('Discontinue medication modal', () => {
  const user = userEvent.setup();
  const onClose = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render discontinue medication modal', () => {
    render(
      <DiscontinueMedicationModal
        onClose={onClose}
        medication={medicationServicesFixture().medication}
        medicationId="386"
        prescriptionDate="2023-02-15"
      />,
      {
        preloadedState: {
          medications: {
            medications: [
              medicationServicesFixture({
                doctor: {
                  source: 'EXTERNAL',
                  name: 'Test doctor',
                  speciality: 'speciality',
                },
              }),
            ],
          },
        },
      },
    );

    expect(screen.getByTestId('discontinueMedicationModal')).toBeInTheDocument();
    expect(screen.getByText(`button.discontinue ${medicationServicesFixture().medication.name}`)).toBeInTheDocument();
    expect(screen.getByTestId('closeButton')).toBeInTheDocument();
    expect(screen.getByTestId('orderedByAutocompleteFreeSoloAsync')).toBeInTheDocument();
    expect(screen.getByTestId('dateDatePicker')).toBeInTheDocument();
    expect(screen.getByTestId('reasonTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('cancelDiscontinueMedicationModalButton')).toBeInTheDocument();
    expect(screen.getByTestId('saveDiscontinueMedicationModalButton')).toBeInTheDocument();
  });

  it('should fill discontinue date field', () => {
    render(
      <DiscontinueMedicationModal
        onClose={onClose}
        medication={medicationServicesFixture().medication}
        medicationId="386"
        prescriptionDate="2023-02-15"
      />,
    );

    expect(screen.getByTestId('dateDatePicker')).toHaveAttribute('value', format(new Date(), 'dd/MM/yyyy'));
  });

  it('should render call close function', async () => {
    render(
      <DiscontinueMedicationModal
        onClose={onClose}
        medication={medicationServicesFixture().medication}
        medicationId="386"
        prescriptionDate="2023-02-15"
      />,
    );

    await act(() => user.click(screen.getByTestId('cancelDiscontinueMedicationModalButton')));
    expect(onClose).toBeCalledTimes(1);
  });
});
