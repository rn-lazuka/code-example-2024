import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import { FeatureGuard } from '@guards';

describe('FeatureGuard', () => {
  const testId = 'testId1';
  const FEATURE_FLAG_NAME = 'FEATURE_FLAG';

  it('should allow rendering children', () => {
    render(
      <FeatureGuard flag={FEATURE_FLAG_NAME}>
        <div data-testid={testId}></div>
      </FeatureGuard>,
    );

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  it('should refuse rendering children', () => {
    global.ENVIRONMENT_VARIABLES = {
      [FEATURE_FLAG_NAME]: 'true',
    };

    render(
      <FeatureGuard flag={FEATURE_FLAG_NAME}>
        <div data-testid={testId}></div>
      </FeatureGuard>,
    );

    expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
  });
});
