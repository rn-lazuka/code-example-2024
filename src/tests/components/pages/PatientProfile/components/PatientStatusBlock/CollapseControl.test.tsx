import { render } from '@unit-tests';
import { screen, fireEvent } from '@testing-library/react';
import { CollapseControl } from '@components//pages/PatientProfile/PatientStatusBlock/components/CollapseControl';

describe('CollapseControl', () => {
  it('renders CollapseControl component', () => {
    render(<CollapseControl status={true} onClick={() => {}} />);
    const collapseControlElement = screen.getByText('showLess');
    expect(collapseControlElement).toBeInTheDocument();
  });

  it('renders CollapseControl component in expanded state', () => {
    render(<CollapseControl status={false} onClick={() => {}} />);
    expect(screen.getByText('showMore')).toBeInTheDocument();
  });

  it('calls onClick prop when control is clicked', () => {
    const onClickMock = jest.fn();
    render(<CollapseControl status={true} onClick={onClickMock} />);
    const controlElement = screen.getByText('showLess');
    fireEvent.click(controlElement);
    expect(onClickMock).toHaveBeenCalled();
  });
});
