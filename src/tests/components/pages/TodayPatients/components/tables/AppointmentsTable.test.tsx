import { AppointmentsTable } from '@components/pages/TodayPatients';
import {
  AppointmentsStatusesFilters,
  PatientIsolationFilterNames,
  TodayPatientsTabs,
  TodayPatientsViewMode,
} from '@enums';
import { appointmentFixture } from '@unit-tests/fixtures';
import { render } from '@unit-tests';
import type { RenderResult } from '@testing-library/react';
import type { TodayPatientsSliceState } from '@types';

const columnLabels = {
  patientName: 'todayPatients:tableView.patientName',
  hdProgress: 'todayPatients:tableView.hdProgress',
  bay: 'todayPatients:tableView.bay',
  startTime: 'todayPatients:tableView.startTime',
  endTime: 'todayPatients:tableView.endTime',
  isolation: 'todayPatients:tableView.isolation',
};

const initialTodayPatientsState: TodayPatientsSliceState = {
  loading: false,
  injectionsLoading: false,
  error: undefined,
  appointments: Array(30).fill(null).map(appointmentFixture),
  filterDate: new Date(),
  activeTab: TodayPatientsTabs.Patients,
  injections: [],
  shifts: [],
  filters: {
    patient: null,
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

describe('AppointmentsTable', () => {
  let r: RenderResult;

  beforeEach(() => {
    r = render(<AppointmentsTable />, {
      preloadedState: { todayPatients: initialTodayPatientsState },
    });
  });

  it('should render the component and all required columns', () => {
    expect(r.queryByText(columnLabels.patientName)).toBeTruthy();
    expect(r.queryByText(columnLabels.hdProgress)).toBeTruthy();
    expect(r.queryByText(columnLabels.bay)).toBeTruthy();
    expect(r.queryByText(columnLabels.startTime)).toBeTruthy();
    expect(r.queryByText(columnLabels.endTime)).toBeTruthy();
    expect(r.queryByText(columnLabels.isolation)).toBeTruthy();
  });

  it('should auto increment the index of each row', () => {
    const rows = r.container.querySelector('table')?.rows;
    const filteredRows = (rows ? [...rows] : []).filter((row) => row?.cells?.item(0)?.textContent);
    [1, 2, 3, 4, 5].forEach((rowIndex) => {
      expect(filteredRows[rowIndex]?.cells?.item(0)?.textContent).toBe(`0${rowIndex}`);
    });
  });

  it('should check that pagination is on the page', () => {
    expect(r.container.querySelector('[data-testid="pagination"]')).toBeTruthy();
  });
});
