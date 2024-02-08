import { render } from '@unit-tests';
import { screen, fireEvent } from '@testing-library/react';
import { ScrollToTopButton } from '@components';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

describe('ScrollToTopButton', () => {
  const user = userEvent.setup();

  it('renders button', () => {
    const containerRef = { current: document.createElement('div') };
    render(<ScrollToTopButton containerRef={containerRef} />);
    expect(screen.getByTestId('ScrollToTopButton')).toBeInTheDocument();
  });

  it('scrolls to top when button is clicked', async () => {
    const containerRef = { current: document.createElement('div') };
    containerRef.current.scrollTo = jest.fn();

    render(<ScrollToTopButton containerRef={containerRef} />);
    await act(() => user.click(screen.getByTestId('ScrollToTopButton')));

    expect(containerRef.current.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('shows button when scrollTop is more than 200px', async () => {
    const container = document.createElement('div');
    const containerRef = { current: container };
    containerRef.current.scrollTop = 201;

    render(<ScrollToTopButton containerRef={containerRef} />);
    fireEvent.scroll(container, { target: { scrollY: 250 } });
    expect(screen.getByTestId('ScrollToTopButton')).toBeVisible();
  });

  it('hides button when scrollTop is less than or equal to 200px', () => {
    const container = document.createElement('div');
    const containerRef = { current: container };
    containerRef.current.scrollTop = 199;

    render(<ScrollToTopButton containerRef={containerRef} />);
    fireEvent.scroll(container, { target: { scrollY: 250 } });
    expect(screen.getByTestId('ScrollToTopButton')).not.toBeVisible();
  });
});
