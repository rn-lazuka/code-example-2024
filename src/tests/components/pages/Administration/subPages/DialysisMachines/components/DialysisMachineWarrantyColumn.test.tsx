import { render } from '@unit-tests';
import { screen } from '@testing-library/dom';
import { DialysisMachineWarrantyColumn } from '@components/pages/Administration/subPages/DialysisMachines/components/DialysisMachineWarrantyColumn';

describe('DialysisMachineWarrantyColumn', () => {
  it('should render the correct icon for warranty truly status', () => {
    render(<DialysisMachineWarrantyColumn warrantyFinished={true} />);
    expect(screen.getByTestId('CancelIcon')).toBeInTheDocument();
  });

  it('should render the correct icon for warranty falsy status', () => {
    render(<DialysisMachineWarrantyColumn warrantyFinished={false} />);
    expect(screen.getByTestId('CheckCircleIcon')).toBeInTheDocument();
  });
});
