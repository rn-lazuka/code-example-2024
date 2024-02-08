import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import { LabOrderStatus as LabOrderStatusType } from '@enums';
import { LabOrderStatus } from '@components/ServicesStatus/LabOrderStatus';

describe('LabOrderStatus component', () => {
  it('renders TO_PERFORM status', () => {
    render(<LabOrderStatus status={LabOrderStatusType.TO_PERFORM} />);
    const icon = screen.getByTestId('labOrderStatusToPerformIcon');
    const label = screen.getByTestId('labOrderStatusLabel');
    expect(icon).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('filters.TO_PERFORM');
  });

  it('renders PENDING status', () => {
    render(<LabOrderStatus status={LabOrderStatusType.PENDING} />);
    const icon = screen.getByTestId('labOrderStatusPendingIcon');
    const label = screen.getByTestId('labOrderStatusLabel');
    expect(icon).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('filters.PENDING');
  });

  it('renders COMPLETED status', () => {
    render(<LabOrderStatus status={LabOrderStatusType.COMPLETED} />);
    const icon = screen.getByTestId('labOrderStatusCompletedIcon');
    const label = screen.getByTestId('labOrderStatusLabel');
    expect(icon).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('filters.COMPLETED');
  });

  it('renders TO_SUBMIT status', () => {
    render(<LabOrderStatus status={LabOrderStatusType.TO_SUBMIT} />);
    const icon = screen.getByTestId('labOrderStatusToSubmitIcon');
    const label = screen.getByTestId('labOrderStatusLabel');
    expect(icon).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('filters.TO_SUBMIT');
  });

  it('renders OMITTED status', () => {
    render(<LabOrderStatus status={LabOrderStatusType.OMITTED} />);
    const icon = screen.getByTestId('labOrderStatusOmittedIcon');
    const label = screen.getByTestId('labOrderStatusLabel');
    expect(icon).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('filters.OMITTED');
  });

  it('renders DRAFT status', () => {
    render(<LabOrderStatus status={LabOrderStatusType.DRAFT} />);
    const icon = screen.getByTestId('labOrderStatusDraftIcon');
    const label = screen.getByTestId('labOrderStatusLabel');
    expect(icon).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('filters.DRAFT');
  });

  it('renders RESCHEDULED status', () => {
    render(<LabOrderStatus status={LabOrderStatusType.RESCHEDULED} />);
    const icon = screen.getByTestId('labOrderStatusOmittedIcon');
    const label = screen.getByTestId('labOrderStatusLabel');
    expect(icon).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('filters.OMITTED');
  });

  it('renders default status', () => {
    const { container } = render(<LabOrderStatus status={'UNKNOWN_STATUS' as any} />);
    expect(container.firstChild).toBeNull();
  });
});
