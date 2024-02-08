import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import { VaccinationStatus as VaccinationStatusType } from '@enums';
import { VaccinationStatus } from '@components/ServicesStatus/VaccinationStatus';

describe('VaccinationStatus component', () => {
  it('renders AdministeredExternal status', () => {
    render(<VaccinationStatus status={VaccinationStatusType.AdministeredExternal} />);
    const icon = screen.getByTestId('vaccinationStatusAdministeredIcon');
    const label = screen.getByTestId('vaccinationStatusLabel');
    expect(icon).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('statuses.ADMINISTERED_EXTERNAL');
  });

  it('renders Omitted status', () => {
    render(<VaccinationStatus status={VaccinationStatusType.Omitted} />);
    const icon = screen.getByTestId('vaccinationStatusOmittedIcon');
    const label = screen.getByTestId('vaccinationStatusLabel');
    expect(icon).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('statuses.OMITTED');
  });

  it('renders Pending status', () => {
    render(<VaccinationStatus status={VaccinationStatusType.Pending} />);
    const icon = screen.getByTestId('vaccinationStatusPendingIcon');
    const label = screen.getByTestId('vaccinationStatusLabel');
    expect(icon).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('statuses.PENDING');
  });

  it('renders NotDone status', () => {
    render(<VaccinationStatus status={VaccinationStatusType.NotDone} />);
    const icon = screen.getByTestId('vaccinationStatusNotDoneIcon');
    const label = screen.getByTestId('vaccinationStatusLabel');
    expect(icon).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('statuses.NOT_DONE');
  });

  it('renders default status', () => {
    const { container } = render(<VaccinationStatus />);
    expect(container.firstChild).toBeNull();
  });
});
