import { DialysisMachineStatus as DialysisMachineStatusEnum } from '@enums';
import { DialysisMachineStatus } from '@components/pages/Administration/subPages/DialysisMachines/components/DialysisMachineStatus';
import { render } from '@unit-tests';
import { screen } from '@testing-library/dom';

describe('DialysisMachineStatus component', () => {
  it('renders correctly with status SPARE', () => {
    render(<DialysisMachineStatus caption status={DialysisMachineStatusEnum.SPARE} />);
    expect(screen.getByTestId('ChangeCircleIcon')).toBeInTheDocument();
  });

  it('renders correctly with status RETIRED', () => {
    render(<DialysisMachineStatus caption status={DialysisMachineStatusEnum.RETIRED} />);
    expect(screen.getByTestId('CancelIcon')).toBeInTheDocument();
  });

  it('renders correctly with status STANDBY', () => {
    render(<DialysisMachineStatus caption status={DialysisMachineStatusEnum.STANDBY} />);
    expect(screen.getByTestId('ErrorIcon')).toBeInTheDocument();
  });

  it('renders correctly with status UNDER_REPAIR', () => {
    render(<DialysisMachineStatus caption status={DialysisMachineStatusEnum.UNDER_REPAIR} />);
    expect(screen.getByTestId('BuildCircleIcon')).toBeInTheDocument();
  });

  it('renders correctly with status ACTIVE', () => {
    render(<DialysisMachineStatus caption status={DialysisMachineStatusEnum.ACTIVE} />);
    expect(screen.getByTestId('CheckCircleIcon')).toBeInTheDocument();
  });

  it('renders nothing when status is undefined', () => {
    const { container } = render(<DialysisMachineStatus />);
    expect(container.firstChild).toBeNull();
  });
});
