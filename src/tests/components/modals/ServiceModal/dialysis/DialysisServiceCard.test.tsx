import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import DialysisServiceCard from '@components/modals/ServiceModal/components/DialysisProcedureModal/components/DialysisServiceCard';

describe('DialysisServiceCard', () => {
  const title = 'TestTitle';
  const children = 'Test children';

  it('should check that the component is being rendered', () => {
    render(
      <DialysisServiceCard title={title} isXs={false}>
        <p>{children}</p>
      </DialysisServiceCard>,
    );
    expect(screen.queryByText(title)).toBeTruthy();
    expect(screen.queryByText(children)).toBeTruthy();
  });
});
