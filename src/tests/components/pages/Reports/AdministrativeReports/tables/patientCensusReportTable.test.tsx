import { format } from 'date-fns';
import { PatientCensusReportTable } from '@components/pages/Reports';
import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import theme from '@src/styles/theme';
import { PatientStatuses } from '@enums';
import { patientCensusInitialState } from '@store/slices';
import { getTimeFromDate, setValueFromCatalog, getCodeValueFromCatalog, getTenantYesterdayDate } from '@utils';
import type { PatientCensusFilters } from '@types';
import { getGenerateReportDate } from '@unit-tests/fixtures';

const addressMock = {
  houseFlat: 'Test house',
  street: 'Test street',
  city: 'Test city',
  countryIso: '238472003',
  postalCode: '348834754894',
  district: 'Test district',
  state: 'Test state',
};

const reportsTableDataMock = {
  id: 1,
  patient: { id: 1, name: 'Test name' },
  documentNumber: '35484856',
  phone: '123456789',
  address: `${addressMock.houseFlat}, ${addressMock.street}, ${addressMock.city}${
    addressMock.district?.length ? ', ' + addressMock.district : ''
  }${addressMock.state?.length ? ', ' + addressMock.state : ''}, ${getCodeValueFromCatalog(
    'country',
    addressMock.countryIso,
  )}, ${addressMock.postalCode}`,
  age: getTimeFromDate('2023-04-09', 'm', false) ?? '-',
  gender: setValueFromCatalog('gender', 'male'),
  race: setValueFromCatalog('race', 'british'),
  religion: setValueFromCatalog('religion', '9999'),
  diagnosis: 'Test diagnosis',
  virology: [],
  treatmentReferral: 'Test doctor / Test Clinic',
  createdAt: format(new Date('2023-04-09T17:17:23.766Z'), 'dd/MM/yyyy'),
  status: setValueFromCatalog('patientStatuses', PatientStatuses.Permanent),
  modifiedAt: format(new Date('2023-03-09T17:17:23.766Z'), 'dd/MM/yyyy'),
  previousStatus: setValueFromCatalog('patientStatuses', PatientStatuses.Walk_In),
};

const filtersInitialState = patientCensusInitialState.reports.filters;
const filtersErrorInitialState = patientCensusInitialState.reports.filtersError;

describe('PatientCensusReportTable', () => {
  it('should render empty body with correct styles', () => {
    render(<PatientCensusReportTable />);

    const emptyBodyId = screen.getByTestId('richTableEmptyBodyContainer');

    expect(emptyBodyId).toBeInTheDocument();
    expect(emptyBodyId).toHaveStyle(`background-color: ${theme.palette.background.default}`);
  });

  it('should render reports data', () => {
    render(<PatientCensusReportTable />, {
      preloadedState: {
        patientCensusReport: {
          reports: {
            content: [reportsTableDataMock],
            filters: filtersInitialState,
            filtersError: filtersErrorInitialState,
          },
        },
      },
    });

    expect(screen.getByText('reports:table.patientName')).toBeInTheDocument();
    expect(screen.getByText(reportsTableDataMock.patient.name)).toBeInTheDocument();
    expect(screen.getByText('reports:table.phone')).toBeInTheDocument();
    expect(screen.getByText(reportsTableDataMock.phone)).toBeInTheDocument();
    expect(screen.getByText('reports:table.nricPass')).toBeInTheDocument();
    expect(screen.getByText(reportsTableDataMock.documentNumber)).toBeInTheDocument();
    expect(screen.getByText('reports:table.address')).toBeInTheDocument();
    expect(screen.getByText(reportsTableDataMock.address)).toBeInTheDocument();
    expect(screen.getByText('reports:table.age')).toBeInTheDocument();
    expect(screen.getByText(reportsTableDataMock.age)).toBeInTheDocument();
    expect(screen.getByText('reports:table.gender')).toBeInTheDocument();
    expect(screen.getByText(reportsTableDataMock.gender)).toBeInTheDocument();
    expect(screen.getByText('reports:table.race')).toBeInTheDocument();
    expect(screen.getByText(reportsTableDataMock.race)).toBeInTheDocument();
    expect(screen.getByText('reports:table.religion')).toBeInTheDocument();
    expect(screen.getByText(reportsTableDataMock.religion)).toBeInTheDocument();
    expect(screen.getByText('reports:table.diagnosis')).toBeInTheDocument();
    expect(screen.getByText(reportsTableDataMock.diagnosis)).toBeInTheDocument();
    expect(screen.getByText('reports:table.drReferHospital')).toBeInTheDocument();
    expect(screen.getByText(reportsTableDataMock.treatmentReferral)).toBeInTheDocument();
    expect(screen.getByText('reports:table.admissionDate')).toBeInTheDocument();
    expect(screen.getByText(reportsTableDataMock.createdAt)).toBeInTheDocument();
    expect(screen.getByText('reports:table.therapyCategory')).toBeInTheDocument();
    expect(screen.getByText(reportsTableDataMock.status)).toBeInTheDocument();
    expect(screen.getByText('reports:table.statusChanged')).toBeInTheDocument();
    expect(screen.getByText(reportsTableDataMock.modifiedAt)).toBeInTheDocument();
    expect(screen.getByText('reports:table.previousStatus')).toBeInTheDocument();
    expect(screen.getByText(reportsTableDataMock.previousStatus)).toBeInTheDocument();
  });

  const checkTitle = (filters: PatientCensusFilters, expectedResult: string) => {
    it('should render correct title, due to applied filters', () => {
      render(<PatientCensusReportTable />, {
        preloadedState: {
          patientCensusReport: {
            reports: {
              content: [reportsTableDataMock],
              filters: { ...filters },
              filtersError: filtersErrorInitialState,
            },
          },
        },
      });

      expect(screen.getByText(expectedResult)).toBeInTheDocument();
    });
  };

  checkTitle(
    { ...filtersInitialState, date: getTenantYesterdayDate() },
    `patientCensusReport ${format(getTenantYesterdayDate(), 'dd/MM/yyyy')} ${getGenerateReportDate()}`,
  );
  checkTitle(
    {
      ...filtersInitialState,
      date: getTenantYesterdayDate(),
      isolations: filtersInitialState.isolations.map((item) => ({ ...item, selected: true })),
      statuses: filtersInitialState.statuses.map((item) => ({ ...item, selected: true })),
    },
    `patientCensusReport ${format(
      getTenantYesterdayDate(),
      'dd/MM/yyyy',
    )} PERMANENT_VISITING_WALK_IN_TEMPORARY_TRANSFERRED_DISCHARGED_HOSPITALIZED_DEAD_NORMAL_ISOLATED_HIV_HEP_B_HEP_C ${getGenerateReportDate()}`,
  );
});
