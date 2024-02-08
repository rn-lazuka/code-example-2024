import { screen } from '@testing-library/react';
import { render } from '@unit-tests';
import { TodayInjectionsTableInjectionsColumn } from '@components/pages/TodayPatients/components/TodayInjections/components/TodayInjectionsTable/components/TodayInjectionsTableInjectionsColumn';
import { injectionFixture } from '@unit-tests/fixtures';
import { InjectionType } from '@enums/global';

const injections = [
  injectionFixture({ type: InjectionType.VACCINE, dosage: '2nd' }),
  injectionFixture(),
  injectionFixture(),
];

describe('TodayInjectionsTableInjectionsColumn', () => {
  it('renders injections with correct name', () => {
    render(<TodayInjectionsTableInjectionsColumn injections={injections} />);

    injections.forEach((injection) => {
      const element = screen.getByTestId(`injection-name-${injection.id}`);
      expect(element).toBeInTheDocument();
      expect(element).toHaveTextContent(
        injection.type === InjectionType.MEDICATION ? injection.name : `${injection.name} ${injection.dosage}`,
      );
    });
  });
});
