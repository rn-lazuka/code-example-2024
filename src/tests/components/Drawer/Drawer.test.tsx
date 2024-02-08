import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { render } from '@unit-tests';
import { Drawer } from '@components';
import { DrawerStatus } from '@enums';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/test',
  }),
}));

describe('Drawer', () => {
  const title = 'Drawer Test';
  const user = userEvent.setup();

  it('should check that the component is being rendered', () => {
    render(<Drawer nextStatus={DrawerStatus.Showed} status={DrawerStatus.Showed} title={title} />);
    expect(screen.queryByText(title)).toBeTruthy();
  });

  it(`should render drawer's footer panel`, () => {
    render(
      <Drawer
        status={DrawerStatus.Showed}
        title={title}
        nextStatus={DrawerStatus.Showed}
        footerChildren={<button data-testid="drawerFooterElement">Button</button>}
      />,
    );
    expect(screen.queryByTestId('drawerFooter')).toBeTruthy();
    expect(screen.queryByTestId('drawerFooterElement')).toBeTruthy();
  });

  it('should test transition between collapsed status and hidden', async () => {
    let status = DrawerStatus.Collapsed;

    const DrawerComponent = () => (
      <Drawer
        status={status}
        title={title}
        nextStatus={status}
        onChangeStatus={(newStatus) => (status = newStatus)}
        footerChildren={<div />}
      >
        <button data-testid="drawerBodyElement">Button</button>
      </Drawer>
    );

    const { rerender } = render(<DrawerComponent />);
    await act(() => user.click(screen.getByTestId('drawerCloseIcon')));

    rerender(<DrawerComponent />);
    expect(screen.getByTestId('drawer').querySelector('.MuiDrawer-paper')).toHaveStyle('right: -100vw');
  });

  it('should check that the component is collapsing', async () => {
    const onChangeStatus = jest.fn();
    const { rerender } = render(
      <Drawer
        status={DrawerStatus.Showed}
        nextStatus={DrawerStatus.Showed}
        title={title}
        onChangeStatus={onChangeStatus}
        footerChildren={<div />}
      >
        <button data-testid="drawerBodyElement">Button</button>
      </Drawer>,
    );
    expect(screen.getByTestId('drawerBodyElement')).toBeVisible();
    expect(screen.getByTestId('drawerFooter')).toBeVisible();

    await act(() => user.click(screen.getByTestId('drawerCloseFullscreenIcon')));
    await rerender(
      <Drawer
        status={DrawerStatus.Collapsed}
        nextStatus={DrawerStatus.Collapsed}
        title={title}
        onChangeStatus={onChangeStatus}
        footerChildren={<div />}
      >
        <button data-testid="drawerBodyElement">Button</button>
      </Drawer>,
    );
    expect(onChangeStatus).toHaveBeenCalledWith(DrawerStatus.Collapsed);
    expect(screen.getByTestId('drawerBodyCollapseWrapper')).toHaveStyle('height: 0px');
    expect(screen.getByTestId('drawerFooterCollapseWrapper')).toHaveStyle('height: 0px');
  });
});
