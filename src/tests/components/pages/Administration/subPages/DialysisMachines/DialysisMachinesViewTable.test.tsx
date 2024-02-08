import { render } from '@unit-tests';
import { screen } from '@testing-library/dom';
import type { DialysisMachinesState } from '@types';
import { dialysisMachineFixture } from '@unit-tests/fixtures/dialysisMachine';
import { DialysisMachinesViewTable } from '@components/pages/Administration';

const columnLabels = {
  name: 'dialysisMachines:table.name',
  status: 'dialysisMachines:table.status',
  serialNumber: 'dialysisMachines:table.serialNumber',
  model: 'dialysisMachines:table.model',
  brand: 'dialysisMachines:table.brand',
  location: 'dialysisMachines:table.connectedBay',
  warranty: 'dialysisMachines:table.warranty',
  isolationGroup: 'dialysisMachines:table.infectionStatus',
};

const initialDialysisMachinesTableState: DialysisMachinesState = {
  statuses: {
    isLoading: false,
    isSubmitting: false,
  },
  error: null,
  machines: [dialysisMachineFixture(1)],
  isolationGroups: [],
  machine: null,
  sortBy: 'name',
  sortDir: 'desc',
  pagination: {
    currentPage: 0,
    perPage: 50,
    totalCount: 0,
  },
};

describe('DialysisMachinesViewTable', () => {
  it('should render noResultsFound', () => {
    render(<DialysisMachinesViewTable />, {
      preloadedState: {
        dialysisMachines: { ...initialDialysisMachinesTableState, machines: [] },
      },
    } as any);
    expect(screen.getByText('noResultsFound')).toBeInTheDocument();
  });

  it('should render the component and all required columns', async () => {
    const machine = initialDialysisMachinesTableState.machines[0];
    render(<DialysisMachinesViewTable />, {
      preloadedState: {
        dialysisMachines: initialDialysisMachinesTableState,
      },
    } as any);

    expect(screen.queryByText(columnLabels.name)).toBeInTheDocument();
    expect(screen.queryByText(columnLabels.brand)).toBeInTheDocument();
    expect(screen.queryByText(columnLabels.isolationGroup)).toBeInTheDocument();
    expect(screen.queryByText(columnLabels.model)).toBeInTheDocument();
    expect(screen.queryByText(columnLabels.serialNumber)).toBeInTheDocument();
    expect(screen.queryByText(columnLabels.status)).toBeInTheDocument();
    expect(screen.queryByText(columnLabels.warranty)).toBeInTheDocument();
    expect(screen.queryByText(machine.name)).toBeInTheDocument();
    expect(screen.queryByText(machine.brand)).toBeInTheDocument();
    expect(screen.queryByText(machine.model)).toBeInTheDocument();
    expect(screen.queryByText(machine.serialNumber)).toBeInTheDocument();
    expect(screen.queryByText('machineStatuses.active')).toBeInTheDocument();
  });
});
