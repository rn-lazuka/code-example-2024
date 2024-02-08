import { render } from '@unit-tests';
import { screen } from '@testing-library/dom';
import { DialysisMachineNameColumn } from '@components/pages/Administration/subPages/DialysisMachines/components';
import { cleanup } from '@testing-library/react';
import { ROUTES } from '@constants/global';

afterEach(cleanup);

describe('DialysisMachineNameColumn', () => {
  it('should render N.A. if location is not provided', () => {
    render(<DialysisMachineNameColumn id={1}>Test Name</DialysisMachineNameColumn>);
    const typographyElement = screen.getByText('Test Name');
    const linkElement = screen.getByText('Test Name').closest('a');
    expect(typographyElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', `/1/${ROUTES.dialysisMachineInformation}`);
    expect(typographyElement).toHaveStyle('overflow: hidden');
    expect(typographyElement).toHaveStyle('white-space: nowrap');
    expect(typographyElement).toHaveStyle('text-overflow: ellipsis');
  });
});
