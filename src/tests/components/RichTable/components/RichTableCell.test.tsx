import { RichTableCell } from '@components/RichTable/components/RichTableCell';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { render } from '@unit-tests';
import { UserPermissions, CellType } from '@enums';

describe('RichTableCell', () => {
  const user = userEvent.setup();

  it('should render cell with checkbox and value', () => {
    render(<RichTableCell cellType={CellType.Checkbox} data={'Patient name'} fullData={{ id: 123 }} />);
    expect(screen.getByTestId('TableCellCheckbox-123')).toBeInTheDocument();
    expect(screen.getByText(/Patient name/i)).toBeInTheDocument();
  });

  it('should render cell with checked checkbox', () => {
    render(<RichTableCell checked={true} cellType={CellType.Checkbox} data={'Patient name'} fullData={{ id: 123 }} />);
    expect(screen.getByTestId('TableCellCheckbox-123')).toHaveAttribute('checked');
  });

  it('should change checkbox state after click', async () => {
    const onCheckboxClick = jest.fn();
    render(
      <RichTableCell
        onRowSelect={onCheckboxClick}
        cellType={CellType.Checkbox}
        data={'Patient name'}
        fullData={{ id: 123 }}
      />,
    );
    await act(() => user.click(screen.getByTestId('TableCellCheckbox-123')));
    expect(onCheckboxClick).toBeCalledTimes(1);
  });

  it('should render cell with submit button if labOrder status is NEW', () => {
    render(<RichTableCell cellType={CellType.LabOrderStatus} data={'TO_PERFORM'} fullData={{ id: 123 }} />);
    expect(screen.getByTestId('LabOrderTO_PERFORMButton-123')).toBeInTheDocument();
  });

  it('should call cellCallback on submit order click if user has permission', async () => {
    const cellCallback = jest.fn();
    render(
      <RichTableCell
        cellCallback={cellCallback}
        cellType={CellType.LabOrderStatus}
        data={'TO_PERFORM'}
        fullData={{ id: 123 }}
      />,
      { preloadedState: { user: { user: { permissions: [UserPermissions.AnalysesSubmitOrder] } } } },
    );
    await act(() => user.click(screen.getByTestId('LabOrderTO_PERFORMButton-123')));
    expect(cellCallback).toBeCalledWith({ data: { id: 123 }, id: 123, status: 'TO_PERFORM' });
  });

  it('should render cell with pending status if labOrder status is PENDING', () => {
    render(<RichTableCell cellType={CellType.LabOrderStatus} data={'PENDING'} fullData={{ id: 123 }} />);
    expect(screen.getByText(/PENDING/i)).toBeInTheDocument();
  });

  it('should render cell with received status if labOrder status is COMPLETED', () => {
    render(<RichTableCell cellType={CellType.LabOrderStatus} data={'COMPLETED'} fullData={{ id: 123 }} />);
    expect(screen.getByText(/COMPLETED/i)).toBeInTheDocument();
  });
});
