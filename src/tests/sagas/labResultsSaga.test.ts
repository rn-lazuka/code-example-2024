import type { Action } from 'redux';
import type { LabResultsFiltersErrors, LabResultsListResponse } from '@types';
import { labResultsAssistanceSaga, labResultsSaga } from '@sagas/labResultsSaga';
import {
  clearLabResultsFilters,
  getLabResultsList,
  getLabResultsListSuccess,
  setLabResultsFilter,
} from '@store/slices/labResultsSlice';
import { runSagaHandler } from '@unit-tests';
import { server } from '@unit-tests/server/serverMock';
import { rest } from 'msw';

const fetchResultMock: LabResultsListResponse = {
  resultPackages: [],
  specifications: [{ categoryCode: 'test', ranges: [] }],
};
const filtersMock = { from: null, to: null, labName: 'Test', procedure: [] };

describe('Lab Results Sagas', () => {
  afterAll(() => jest.clearAllMocks());

  describe('labResultsSaga', () => {
    it('should fetch lab results', async () => {
      server.use(
        rest.post(`${process.env.DEVELOPMENT_API_TARGET}/pm/lab-results/search`, (req, res, ctx) => {
          return res(ctx.json(fetchResultMock));
        }),
      );
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, { labResults: { filters: filtersMock } }, labResultsSaga, {
        type: getLabResultsList.type,
        payload: 1,
      });
      expect(dispatched).toEqual([getLabResultsListSuccess(fetchResultMock)]);
    });

    it('should call "getLabResultsListSuccess" action with empty data, when error occurred', async () => {
      server.use(
        rest.post(`${process.env.DEVELOPMENT_API_TARGET}/pm/lab-results/search`, (req, res, ctx) => {
          return res.once(ctx.status(404), ctx.json({}));
        }),
      );
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, { labResults: { filters: filtersMock } }, labResultsSaga, {
        type: getLabResultsList.type,
        payload: 1,
      });

      expect(dispatched).toEqual([
        {
          type: getLabResultsListSuccess.type,
          payload: { resultPackages: [], specifications: [] },
        },
      ]);
    });

    it('should skip fetching lab results, when there is no "type" and "payload" in action', async () => {
      const dispatched: Action[] = [];
      await runSagaHandler(dispatched, { labResults: { filters: filtersMock } }, labResultsSaga, {});

      expect(dispatched).toEqual([
        {
          type: getLabResultsListSuccess.type,
          payload: { resultPackages: [], specifications: [] },
        },
      ]);
    });
  });

  describe('labResultsAssistanceSaga', () => {
    const checkLabResultsAssistanceSaga = (
      actionType: string,
      filtersError: LabResultsFiltersErrors,
      shouldCallAction: boolean,
    ) => {
      it('should handle lab results filters changes', async () => {
        const dispatched: Action[] = [];

        await runSagaHandler(
          dispatched,
          {
            labResults: { filtersError },
            patient: { patient: { id: 1 } },
          },
          labResultsAssistanceSaga,
          { type: actionType },
        );

        expect(dispatched).toEqual(shouldCallAction ? [{ type: getLabResultsList.type, payload: 1 }] : []);
      });
    };

    checkLabResultsAssistanceSaga(setLabResultsFilter.type, { from: null, to: null }, true);
    checkLabResultsAssistanceSaga(clearLabResultsFilters.type, { from: null, to: null }, true);
    checkLabResultsAssistanceSaga('', { from: null, to: null }, false);
    checkLabResultsAssistanceSaga(setLabResultsFilter.type, { from: 'test', to: null }, false);
    checkLabResultsAssistanceSaga(setLabResultsFilter.type, { from: null, to: 'test' }, false);
  });
});
