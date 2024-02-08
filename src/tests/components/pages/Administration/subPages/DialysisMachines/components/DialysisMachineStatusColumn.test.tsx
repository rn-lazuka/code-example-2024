import { DialysisMachineStatusColumn } from '@components/pages/Administration/subPages/DialysisMachines/components';
import { DialysisMachineStatus } from '@enums/global';
import { render } from '@unit-tests';
import { screen } from '@testing-library/dom';

describe('DialysisMachineStatusColumn', () => {
  it('renders the correct icon and text for the SPARE status', () => {
    render(<DialysisMachineStatusColumn status={DialysisMachineStatus.SPARE} />);

    expect(screen.getByText('machineStatuses.spare')).toBeInTheDocument();
    expect(screen.getByTestId('ChangeCircleIcon')).toBeInTheDocument();
  });

  it('renders the correct icon and text for the RETIRED status', () => {
    render(<DialysisMachineStatusColumn status={DialysisMachineStatus.RETIRED} />);

    expect(screen.getByText('machineStatuses.retired')).toBeInTheDocument();
    expect(screen.getByTestId('CancelIcon')).toBeInTheDocument();
  });

  it('renders the correct icon and text for the STANDBY status', () => {
    render(<DialysisMachineStatusColumn status={DialysisMachineStatus.STANDBY} />);

    expect(screen.getByText('machineStatuses.standby')).toBeInTheDocument();
    expect(screen.getByTestId('ErrorIcon')).toBeInTheDocument();
  });

  it('renders the correct icon and text for the UNDER_REPAIR status', () => {
    render(<DialysisMachineStatusColumn status={DialysisMachineStatus.UNDER_REPAIR} />);

    expect(screen.getByText('machineStatuses.underRepair')).toBeInTheDocument();
    expect(screen.getByTestId('BuildCircleIcon')).toBeInTheDocument();
  });

  it('renders the correct icon and text for the ACTIVE status', () => {
    render(<DialysisMachineStatusColumn status={DialysisMachineStatus.ACTIVE} />);

    expect(screen.getByText('machineStatuses.active')).toBeInTheDocument();
    expect(screen.getByTestId('CheckCircleIcon')).toBeInTheDocument();
  });
});
