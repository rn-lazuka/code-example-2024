import { screen } from '@testing-library/dom';
import { render } from '@unit-tests/_utils';
import { DialysisServiceStepDataRow } from '@components/modals/ServiceModal/components/DialysisProcedureModal/components/steps/components/DialysisServiceStepDataRow';

describe('DialysisServiceStepDataRow', () => {
  it('renders with the provided props', () => {
    const props = {
      isXs: false,
      name: 'Name',
      value: 'Value',
      additionalValue: 'Additional Value',
    };

    render(<DialysisServiceStepDataRow {...props} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByText('Additional Value')).toBeInTheDocument();
  });

  it('renders with default values when optional props are not provided', () => {
    const props = {
      isXs: false,
      name: 'Name',
      value: 'Value',
    };

    render(<DialysisServiceStepDataRow {...props} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.queryByTestId('DialysisServiceStepDataRowAdditionalValue')).not.toBeInTheDocument();
  });
});
