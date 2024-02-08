import { render } from '@unit-tests';
import { screen } from '@testing-library/dom';
import { DialysisMachineConnectedBayColumn } from '@components/pages/Administration/subPages/DialysisMachines/components';
import { cleanup } from '@testing-library/react';

afterEach(cleanup);

describe('DialysisMachineConnectedBayColumn', () => {
  it('should render N.A. if location is not provided', () => {
    render(<DialysisMachineConnectedBayColumn />);
    expect(screen.getByText('NA')).toBeInTheDocument();
  });

  it('should render the location name if location is provided', () => {
    const location = { id: 1, name: 'Bay 1' };
    render(<DialysisMachineConnectedBayColumn location={location} />);
    expect(screen.getByText(location.name)).toBeInTheDocument();
  });
});
