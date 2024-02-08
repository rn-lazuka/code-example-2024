import { screen } from '@testing-library/dom';
import { fireEvent } from '@testing-library/react';
import { render } from '@unit-tests/_utils';
import CollapseAllButton from '@components/CollapseAllButton/CollapseAllButton';

describe('CollapseAllButton', () => {
  it('renders CollapseAllButton correctly', () => {
    render(<CollapseAllButton isAllCollapsed={false} onClick={() => {}} />);

    expect(screen.getByTestId('CollapseAllButton')).toBeTruthy();
  });

  it('handles click events correctly', () => {
    const onClickMock = jest.fn();
    render(<CollapseAllButton isAllCollapsed={false} onClick={onClickMock} />);

    fireEvent.click(screen.getByTestId('CollapseAllButton'));

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('applies styles based on isAllCollapsed prop', () => {
    render(<CollapseAllButton isAllCollapsed={true} onClick={() => {}} />);

    const icon = screen.getByTestId('CollapseAllButtonIcon');
    expect(icon).toHaveStyle('transform: rotateX(0)');
  });
});
