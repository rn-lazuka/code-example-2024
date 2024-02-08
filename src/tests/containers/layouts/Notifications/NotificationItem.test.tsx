import { screen } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';
import { render } from '@unit-tests';
import { NotificationItem } from '@containers/layouts/Notifications/NotificationItem';
import { notificationFixture } from '@unit-tests/fixtures/notifications';
import userEvent from '@testing-library/user-event';

describe('NotificationItem', () => {
  const onClose = jest.fn();
  const user = userEvent.setup();

  it('should render notification with link to hd prescription page', () => {
    render(<NotificationItem onClose={onClose} notification={notificationFixture()} />);
    expect(screen.getByTestId('notificationItem-1/patients-overview/1/hd-prescription')).toBeInTheDocument();
    expect(screen.getByText(/HD prescription for/i)).toBeTruthy();
  });

  it('should render notification with link to lab results page', () => {
    render(
      <NotificationItem onClose={onClose} notification={notificationFixture({ navigationScreen: 'LAB_RESULTS' })} />,
    );
    expect(screen.getByTestId('notificationItem-1/patients-overview/1/lab-results')).toBeInTheDocument();
  });

  it('should render notification with link to medications page', () => {
    render(
      <NotificationItem onClose={onClose} notification={notificationFixture({ navigationScreen: 'MEDICATIONS' })} />,
    );
    expect(screen.getByTestId('notificationItem-1/patients-overview/1/medication')).toBeInTheDocument();
  });

  it('should render notification with link to the same page', () => {
    render(<NotificationItem onClose={onClose} notification={notificationFixture({ navigationScreen: null })} />);
    expect(screen.getByTestId('notificationItem-1#')).toBeInTheDocument();
  });

  it('should close notifications on item click', async () => {
    render(<NotificationItem onClose={onClose} notification={notificationFixture()} />);
    const notification = screen.getByTestId('notificationItem-1/patients-overview/1/hd-prescription');
    expect(notification).toBeInTheDocument();
    await act(() => user.click(notification));

    expect(onClose).toBeCalledTimes(1);
  });
});
