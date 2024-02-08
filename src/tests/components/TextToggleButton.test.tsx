import { screen } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';
import { render } from '@unit-tests';
import { TextToggleButton } from '@components/TextToggleButton/TextToggleButton';
import userEvent from '@testing-library/user-event';
import palette from '@src/styles/theme/palette';

const title = 'Test title';
const value = 'Test value';

const titleId = 'textToggleButtonTitle';
const badgeId = 'textToggleButtonBadge';
const badgeTitleId = 'textToggleButtonBadgeText';

describe('TextToggleButton', () => {
  const user = userEvent.setup();

  it('should display title', () => {
    render(<TextToggleButton value={value} title={title} isSelected={false} onChange={() => {}} />);

    expect(screen.getByTestId(titleId)).toBeInTheDocument();
    expect(screen.getByText(title)).toBeTruthy();
  });

  it('should display badge, if prop "badge" is passed', () => {
    render(<TextToggleButton value={value} title={title} isSelected={false} badge="30" onChange={() => {}} />);

    expect(screen.getByTestId(badgeId)).toBeInTheDocument();
    expect(screen.getByText('30')).toBeTruthy();
  });

  it('should not display badge, if prop "badge" is not passed', () => {
    render(<TextToggleButton value={value} title={title} isSelected={false} onChange={() => {}} />);

    expect(screen.queryByTestId(badgeId)).not.toBeInTheDocument();
  });

  it('should call change handler', async () => {
    const changeHandler = jest.fn();
    render(<TextToggleButton value={value} title={title} isSelected={false} onChange={changeHandler} />);

    await act(() => user.click(screen.getByTestId(`${value}TextToggleButton`)));

    expect(changeHandler).toBeCalled();
  });

  it('should apply correct styles, when button is selected', () => {
    render(<TextToggleButton value={value} title={title} isSelected={true} badge="30" onChange={() => {}} />);

    expect(screen.getByTestId(titleId)).toHaveStyle(`color: ${palette.text.white}`);
    expect(screen.getByTestId(badgeId)).toHaveStyle(`background-color: ${palette.primary.main}`);
    expect(screen.getByTestId(badgeTitleId)).toHaveStyle(`color: ${palette.text.white}`);
  });

  it('should apply correct styles, when button is not selected', () => {
    render(<TextToggleButton value={value} title={title} isSelected={false} badge="30" onChange={() => {}} />);

    expect(screen.getByTestId(titleId)).toHaveStyle(`color: ${palette.primary.main}`);
    expect(screen.getByTestId(badgeId)).toHaveStyle(`background-color: ${palette.primary.main}`);
    expect(screen.getByTestId(badgeTitleId)).toHaveStyle(`color: ${palette.text.white}`);
  });
});
