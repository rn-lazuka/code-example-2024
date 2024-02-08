import { render } from '@unit-tests';
import { InjectionStatus } from '@enums';
import { TodayInjectionsTableStatusColumn } from '@components/pages/TodayPatients/components/TodayInjections/components/TodayInjectionsTable/components/TodayInjectionsTableStatusColumn';
import { injectionFixture } from '@unit-tests/fixtures';
import { screen } from '@testing-library/dom';

describe('TodayInjectionsTableStatusColumn', () => {
  it('renders the correct icon for each injection status', () => {
    const injections = [
      injectionFixture({ id: 1, status: InjectionStatus.ADMINISTERED }),
      injectionFixture({ id: 2, status: InjectionStatus.PENDING }),
      injectionFixture({ id: 3, status: InjectionStatus.OMITTED }),
    ];
    render(<TodayInjectionsTableStatusColumn injections={injections} />);

    expect(screen.getByTestId('injection-status-1')).toBeInTheDocument();
    expect(screen.getByTestId('injection-status-2')).toBeInTheDocument();
    expect(screen.getByTestId('injection-status-3')).toBeInTheDocument();
  });
});
