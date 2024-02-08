import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import { NeedleSizeRadioLabel } from '@components/pages/PatientProfile';
import { NeedleSize } from '@enums';

describe('Label for needle size radio group', () => {
  it('should render label with 300MlMin text', () => {
    render(<NeedleSizeRadioLabel label={NeedleSize.Gauge17} />);
    expect(screen.getByText(/modal.300MlMin/i)).toBeInTheDocument();
  });

  it('should render label with 300350MlMin text', () => {
    render(<NeedleSizeRadioLabel label={NeedleSize.Gauge16} />);
    expect(screen.getByText(/modal.300350MlMin/i)).toBeInTheDocument();
  });

  it('should render label with 350450MlMin text', () => {
    render(<NeedleSizeRadioLabel label={NeedleSize.Gauge15} />);
    expect(screen.getByText(/modal.350450MlMin/i)).toBeInTheDocument();
  });

  it('should render label with 450MlMin text', () => {
    render(<NeedleSizeRadioLabel label={NeedleSize.Gauge14} />);
    expect(screen.getByText(/modal.450MlMin/i)).toBeInTheDocument();
  });
});
