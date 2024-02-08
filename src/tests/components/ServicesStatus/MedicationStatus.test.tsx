import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import { MedicationStatus } from '@components/ServicesStatus/MedicationStatus';
import { VaccinationMedicationResolution } from '@enums';

describe('MedicationStatus component', () => {
  it('renders Administered status', () => {
    render(<MedicationStatus status={VaccinationMedicationResolution.Administered} />);
    const icon = screen.getByTestId('medicationStatusCheckCircleIcon');
    const label = screen.getByTestId('medicationStatusLabel');
    expect(icon).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('service.administered');
  });

  it('renders Rescheduled status', () => {
    render(<MedicationStatus status={VaccinationMedicationResolution.Rescheduled} />);
    const icon = screen.getByTestId('medicationStatusCancelIcon');
    const label = screen.getByTestId('medicationStatusLabel');
    expect(icon).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('service.omitted');
  });

  it('renders Omitted status', () => {
    render(<MedicationStatus status={VaccinationMedicationResolution.Omitted} />);
    const icon = screen.getByTestId('medicationStatusCancelIcon');
    const label = screen.getByTestId('medicationStatusLabel');
    expect(icon).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('service.omitted');
  });

  it('renders default status', () => {
    render(<MedicationStatus />);
    const icon = screen.getByTestId('medicationStatusChangeCircleIcon');
    const label = screen.getByTestId('medicationStatusLabel');
    expect(icon).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('service.pending');
  });
});
