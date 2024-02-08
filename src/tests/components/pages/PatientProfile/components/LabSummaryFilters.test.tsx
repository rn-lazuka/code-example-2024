import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import { LabSummaryFilters } from '@components/pages/PatientProfile/subPages';

const filters = {
  from: new Date(),
  to: new Date(),
  procedures: [
    { label: 'rd-1', value: '1' },
    { label: 'rd-2', value: '2' },
  ],
  labName: ['1'],
};

const filtersError = {
  from: null,
  to: null,
};

describe('LabSummaryFilters', () => {
  it('should show filter block with fields', async () => {
    render(<LabSummaryFilters dataLength={1} />, {
      preloadedState: { labOrders: { filters, filtersError } },
    });

    expect(screen.getByTestId('fromDatePicker')).toBeInTheDocument();
    expect(screen.getByTestId('toDatePicker')).toBeInTheDocument();
    expect(screen.getByTestId('proceduresAutocompleteMultiple')).toBeInTheDocument();
    expect(screen.getByTestId('labNameSelectInput')).toBeInTheDocument();
  });
});
