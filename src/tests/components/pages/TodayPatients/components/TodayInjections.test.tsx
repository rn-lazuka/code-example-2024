import {
  AppointmentsStatusesFilters,
  PatientIsolationFilterNames,
  TodayPatientsTabs,
  TodayPatientsViewMode,
} from '@enums';
import TodayInjections from '@components/pages/TodayPatients/components/TodayInjections/TodayInjections';
import { shifts } from '@unit-tests/fixtures';
import { defaultPlannedInjectionsResponse } from '@unit-tests/server/responses';
import { getTestStore, render } from '@unit-tests';
import type { RenderResult } from '@testing-library/react';
import type { TodayPatientsSliceState } from '@types';

const columnLabels = {
  patientName: 'todayPatients:injectionsTableView.patientName',
  bay: 'todayPatients:injectionsTableView.bay',
  todayInjections: 'todayPatients:injectionsTableView.todayInjections',
  amount: 'todayPatients:injectionsTableView.amount',
  prepared: 'todayPatients:injectionsTableView.prepared',
  status: 'todayPatients:injectionsTableView.status',
};

const initialTodayPatientsState: TodayPatientsSliceState = {
  loading: false,
  injectionsLoading: false,
  error: undefined,
  appointments: [],
  filterDate: new Date(),
  activeTab: TodayPatientsTabs.Injections,
  injections: defaultPlannedInjectionsResponse,
  shifts: [{ ...shifts[0], id: 7 }],
  filters: {
    patient: {
      name: 'name',
      id: '1',
    },
    isolation: {
      items: [
        {
          name: PatientIsolationFilterNames.normal,
          checked: false,
        },
        {
          name: PatientIsolationFilterNames.hepB,
          checked: false,
        },
        {
          name: PatientIsolationFilterNames.hepC,
          checked: false,
        },
        {
          name: PatientIsolationFilterNames.hiv,
          checked: false,
        },
      ],
    },
    statuses: {
      items: [
        {
          name: AppointmentsStatusesFilters.All,
          selected: true,
          badge: '0',
        },
        {
          name: AppointmentsStatusesFilters.Waitlist,
          selected: false,
          badge: '0',
        },
        {
          name: AppointmentsStatusesFilters.InProgress,
          selected: false,
          badge: '0',
        },
        {
          name: AppointmentsStatusesFilters.Complete,
          selected: false,
          badge: '0',
        },
        {
          name: AppointmentsStatusesFilters.Cancelled,
          selected: false,
          badge: '0',
        },
      ],
    },
  },
  pagination: {
    currentPage: 0,
    perPage: 20,
    totalCount: 30,
  },
  viewMode: TodayPatientsViewMode.Table,
};

const dispatch = jest.fn();
const store = getTestStore({
  todayPatients: initialTodayPatientsState,
});
store.dispatch = dispatch;

describe('TodayInjections', () => {
  let r: RenderResult;

  beforeEach(() => {
    r = render(<TodayInjections />, {
      store,
    } as any);
  });

  it('should render the component and all required columns', () => {
    expect(r.queryByText(columnLabels.patientName)).toBeTruthy();
    expect(r.queryByText(columnLabels.bay)).toBeTruthy();
    expect(r.queryByText(columnLabels.amount)).toBeTruthy();
    expect(r.queryByText(columnLabels.prepared)).toBeTruthy();
    expect(r.queryByText(columnLabels.todayInjections)).toBeTruthy();
    expect(r.queryByText(columnLabels.status)).toBeTruthy();
  });
});
