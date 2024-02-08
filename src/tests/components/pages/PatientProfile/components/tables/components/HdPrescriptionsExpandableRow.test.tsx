import type { HdPrescription } from '@types';
import { screen } from '@testing-library/dom';
import { format } from 'date-fns';
import { render } from '@unit-tests';
import { HdPrescriptionsExpandableRow } from '@components/pages/PatientProfile';
import { prescriptionFixture } from '@unit-tests/fixtures/prescriptions';
import { UserPermissions } from '@enums';

describe('HdPrescriptionsExpandableRow', () => {
  const prescription: HdPrescription = prescriptionFixture();

  it('should render the collapsed component', () => {
    render(<HdPrescriptionsExpandableRow {...prescription} />);
    expect(screen.queryByTestId('changeHdPrescriptionButton')).toBeNull();
    expect(screen.getByText(prescription.prescribedBy.name)).toBeTruthy();
    expect(screen.getByText((prescription as any).enteredBy?.name)).toBeTruthy();
    expect(screen.getByText(prescription.comments)).toBeTruthy();
    expect(screen.getByText(format(new Date(prescription.enteredAt), 'MM/dd/yyyy HH:mm a'))).toBeTruthy();
    expect(screen.getByText(format(new Date(prescription.prescriptionDate), 'MM/dd/yyyy'))).toBeTruthy();
  });

  it('should render edit button if user has permission', () => {
    render(<HdPrescriptionsExpandableRow {...prescription} />, {
      preloadedState: { user: { user: { permissions: [UserPermissions.DialysisEditPrescriptions] } } },
    });
    expect(screen.getByTestId('changeHdPrescriptionButton')).toBeInTheDocument();
  });
});
