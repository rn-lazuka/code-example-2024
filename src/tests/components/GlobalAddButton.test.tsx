import { screen } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';
import { render } from '@unit-tests';
import { GlobalAddButton } from '@components/GlobalAddButton/GlobalAddButton';
import userEvent from '@testing-library/user-event';

describe('GlobalAddButton', () => {
  const user = userEvent.setup();

  it('should call "onClick" handler', async () => {
    const clickHandler = jest.fn();
    render(<GlobalAddButton onClick={clickHandler} />);

    await act(() => user.click(screen.getByTestId('globalAddButtonId')));

    expect(clickHandler).toBeCalled();
  });
});
