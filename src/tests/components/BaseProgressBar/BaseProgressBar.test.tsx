import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import { BaseProgressBar } from '@components/BaseProgressBar/BaseProgressBar';

describe('BaseProgressBar', () => {
  it('should display label, and progress with right percentage of fullness', () => {
    render(<BaseProgressBar current={35} label="-01h:30m" />);

    expect(screen.getByTestId('BaseProgressBarLine')).toHaveStyle('width: 35%');
    expect(screen.getByText('-01h:30m')).toBeTruthy();
  });

  it('should display yellow color if progress not equals 100%', () => {
    render(<BaseProgressBar current={35} label="" />);
    expect(screen.getByTestId('BaseProgressBarLine')).toHaveStyle('background-color: #F7E468');
  });

  it('should display green color and label "Finished" if progress equals 100%', () => {
    render(<BaseProgressBar current={100} label="" />);
    expect(screen.getByTestId('BaseProgressBarLine')).toHaveStyle('background-color: #83FAAE');
  });

  it('should have 100% width even if percentage is bigger than 100', () => {
    render(<BaseProgressBar current={130} label="" />);
    expect(screen.getByTestId('BaseProgressBarLine')).toHaveStyle('width: 100%');
  });

  it('should display "in progress icon", when process is not finished', () => {
    render(<BaseProgressBar current={87} label="" />);
    expect(screen.getByTestId('BaseProgressBarInProgressIcon')).toBeInTheDocument();
    expect(screen.queryByTestId('BaseProgressBarProgressDoneIcon')).not.toBeInTheDocument();
  });

  it('should display "progress done icon" and label must be "Finished", when process is finished', () => {
    render(<BaseProgressBar current={100} label="" finished={true} />);
    expect(screen.getByTestId('BaseProgressBarProgressDoneIcon')).toBeInTheDocument();
    expect(screen.queryByTestId('BaseProgressBarInProgressIcon')).not.toBeInTheDocument();
    expect(screen.getByText('finished')).toBeTruthy();
  });
});
