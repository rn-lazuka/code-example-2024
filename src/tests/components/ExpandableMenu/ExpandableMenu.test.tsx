import { screen } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';
import { render } from '@unit-tests';
import { ExpandableMenu } from '@components/ExpandableMenu/ExpandableMenu';
import userEvent from '@testing-library/user-event';

const label = 'Test label';
const labelId = 'expandableMenuLabel';
const menuId = 'expandableMenuContainer';
const groupedMenuItemId = 'expandableMenuGroupedItem';

const optionCallback = jest.fn();
const options = [
  { value: 'test 1', optionCallback },
  { value: 'test 2', optionCallback },
  { value: 'test 3', optionCallback },
];
const groupedOptions = [{ name: 'test subheader', options }];

describe('ExpandableMenu', () => {
  const user = userEvent.setup();

  it('should render nothing', () => {
    render(<ExpandableMenu label={label} />);
    expect(screen.queryByText(label)).not.toBeTruthy();
  });

  it('should open menu, when click on label', async () => {
    render(<ExpandableMenu label={label} options={options} />);
    await act(() => user.click(screen.getByTestId(labelId)));
    expect(screen.getByTestId(menuId)).toBeVisible();
  });

  it('should call "optionCallback" handler and close the menu, when click on menu item', async () => {
    render(<ExpandableMenu label={label} options={options} />);

    await act(() => user.click(screen.getByTestId(labelId)));

    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems[0]).toBeVisible();
    expect(menuItems).toHaveLength(3);

    await act(() => user.click(menuItems[0]));

    expect(optionCallback).toBeCalledTimes(1);
    expect(menuItems[0]).not.toBeVisible();
  });

  it('should render grouped menu', async () => {
    render(<ExpandableMenu label={label} groupedOptions={groupedOptions} />);
    await act(() => user.click(screen.getByTestId(labelId)));
    const menuItems = screen.getAllByRole('menuitem');

    expect(menuItems).toHaveLength(3);
    expect(menuItems[0]).toBeVisible();
    expect(screen.getAllByTestId(groupedMenuItemId)).toHaveLength(1);
    expect(screen.getAllByTestId('expandableMenuGroupedItemSubHeader')[0]).toBeVisible();
    expect(screen.getAllByTestId('expandableMenuGroupedItemSubHeader')[0]).toHaveStyle('text-transform: uppercase');
  });
});
