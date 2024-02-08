import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import { DoctorReviewStatus as DoctorReviewStatusType } from '@enums';
import { DoctorReviewStatus } from '@components/ServicesStatus/DoctorReviewStatus';

describe('DoctorReviewStatus component', () => {
  it('renders PENDING status', () => {
    render(<DoctorReviewStatus status={DoctorReviewStatusType.PENDING} />);
    const icon = screen.getByTestId('doctorReviewStatusPendingIcon');
    const label = screen.getByTestId('doctorReviewStatusLabel');
    expect(icon).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('statuses.PENDING');
  });

  it('renders PERFORMED status', () => {
    render(<DoctorReviewStatus status={DoctorReviewStatusType.PERFORMED} />);
    const icon = screen.getByTestId('doctorReviewStatusPerformedIcon');
    const label = screen.getByTestId('doctorReviewStatusLabel');
    expect(icon).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('statuses.PERFORMED');
  });

  it('renders OMITTED status', () => {
    render(<DoctorReviewStatus status={DoctorReviewStatusType.OMITTED} />);
    const icon = screen.getByTestId('doctorReviewStatusOmittedIcon');
    const label = screen.getByTestId('doctorReviewStatusLabel');
    expect(icon).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('statuses.OMITTED');
  });

  it('renders default status', () => {
    const { container } = render(<DoctorReviewStatus status={'UNKNOWN_STATUS' as any} />);
    expect(container.firstChild).toBeNull();
  });
});
