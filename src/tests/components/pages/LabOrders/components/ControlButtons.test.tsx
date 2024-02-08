import { ControlButtons } from '@components/pages/LabOrders';
import { LabOrdersPlace, LabOrderStatus, UserPermissions } from '@enums';
import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';

const initialOrdersState = {
  ordersList: [
    { id: 1, status: LabOrderStatus.TO_SUBMIT },
    { id: 2, status: LabOrderStatus.COMPLETED },
    { id: 3, status: LabOrderStatus.PENDING },
    { id: 4, status: LabOrderStatus.TO_SUBMIT },
  ],
  selectedRows: [1, 3, 4],
  filters: {
    from: new Date('2022-12-07T09:19:36.673Z'),
    to: new Date('2022-12-07T09:19:36.673Z'),
    patient: {
      id: '52',
      name: '',
    },
    procedures: [],
    labIds: [],
    orderStatus: [],
    order: null,
    shifts: [],
  },
};

describe('ControlButtons', () => {
  it('should show a submit button with amount of the orders to submit if user has permission and orders are selected', () => {
    render(<ControlButtons place={LabOrdersPlace.Profile} />, {
      preloadedState: {
        labOrders: initialOrdersState,
        user: { user: { permissions: [UserPermissions.AnalysesSubmitOrder] } },
      },
    });
    expect(screen.getByTestId('submitAllOrdersButton')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
