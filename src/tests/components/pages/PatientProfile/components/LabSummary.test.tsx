import type { RenderResult } from '@testing-library/react';
import type { LabResultsSliceState } from '@types';
import { render } from '@unit-tests';
import { LabSummary } from '@components/pages/PatientProfile/subPages';

const columnLabels = {
  procedureTest: 'labOrders:tables.resultsView.procedureTest',
  labName: 'labOrders:tables.resultsView.labName',
  range: 'labOrders:tables.resultsView.range',
};

const initialLabResultsState: LabResultsSliceState = {
  statuses: {
    isLoading: false,
    isFileLoading: false,
  },
  specifications: [
    {
      categoryCode: 'Category-1',
      ranges: [
        {
          code: 'code-1',
          range: '100-200',
          measurement: 'measurement-100-test',
          order: 1,
        },
      ],
    },
  ],
  labResultsList: [
    {
      labName: 'LAB NAME TEST',
      completedAt: new Date().toString(),
      procedureCode: 'code-1',
      testSets: [
        {
          categoryCode: 'string',
          tests: [
            {
              code: 'string',
              value: 'string',
            },
          ],
        },
      ],
      procedureName: 'RDP-1',
      labOrderId: 123,
      filePresent: false,
    },
  ],
  filters: {
    from: new Date(),
    to: new Date(),
    procedure: [],
    labName: [],
  },
  filtersError: {
    from: null,
    to: null,
  },
};

describe('LabSummary', () => {
  let r: RenderResult;

  it('should render all necessary elements', () => {
    r = render(<LabSummary />, {
      preloadedState: { labResults: initialLabResultsState },
    });
    expect(r.queryByText(columnLabels.procedureTest)).toBeInTheDocument();
    expect(r.queryByText(columnLabels.range)).toBeInTheDocument();
    expect(r.queryByText(columnLabels.labName)).toBeInTheDocument();
    expect('100-200').toBeTruthy();
    expect('measurement-100-test').toBeTruthy();
    expect('LAB NAME TEST').toBeTruthy();
    expect('Category-1').toBeTruthy();
  });
});
