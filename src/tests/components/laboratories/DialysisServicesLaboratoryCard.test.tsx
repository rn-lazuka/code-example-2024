import { render } from '@unit-tests';
import { DialysisServicesLaboratoryCard } from '@components/modals/ServiceModal/components/DialysisProcedureModal/components/steps/components/DialysisServicesLaboratoryCard';
import { ServiceModalName, UserPermissions, DialysisStatus } from '@enums';
import { waitFor } from '@testing-library/dom';
import { format } from 'date-fns';
import { getTenantDate } from '@utils/getTenantDate';
import { patient, labOrderContentFixture } from '@unit-tests/fixtures';

const PATIENT_ID = 123;
const ORDER_ID = 234;

const serviceModalPayloadWithDefault = {
  patientId: PATIENT_ID,
};

const dialysisState = {
  loading: false,
  services: {
    labOrders: [labOrderContentFixture({ id: ORDER_ID })],
  },
  patient,
  labOrders: {
    statuses: {
      isLoading: false,
      isSubmitting: false,
      isCannotBeCreated: false,
    },
    order: null,
    ordersList: [],
    pagination: {
      currentPage: 0,
      perPage: 50,
      totalCount: 0,
    },
    sortBy: 'createdAt',
    error: undefined,
    filters: {
      from: new Date(),
      to: new Date(),
      patient: null,
      appointmentId: undefined,
      procedures: [],
      labIds: [],
      orderStatus: [],
      order: null,
      shifts: [],
    },
    filtersError: {
      from: null,
      to: null,
    },
  },
  metaData: {
    event: '',
  },
  date: format(getTenantDate(), 'yyyy-MM-dd'),
  status: {
    activeStep: DialysisStatus.CheckIn,
  },
};

/*const getProcedureMock = (id: number, isPackage: boolean = false) => ({
  id,
  isPackage,
  name: `Procedure-${id}`,
});*/

/*const getLabMock = (id: number, isDefault: boolean = false) => ({
  id,
  isDefault,
  name: `Laboratory-${id}`,
  code: `Laboratory-code-${id}`,
  branchId: 1,
});*/

describe('DialysisServicesLaboratoryCard', () => {
  /*  const user = userEvent.setup();*/
  let r;

  beforeEach(() => {
    r = render(<DialysisServicesLaboratoryCard isXs={false} />, {
      preloadedState: {
        dialysis: dialysisState,
        user: {
          user: {
            permissions: [UserPermissions.DialysisAddMeasurement],
          },
        },
        serviceModal: {
          [ServiceModalName.DialysisProcedureModal]: serviceModalPayloadWithDefault,
        },
      },
    });
  });

  it('should render laboratory card and one order with all necessary elements', async () => {
    await waitFor(() => {
      expect(r.queryByTestId(`labOrder${ORDER_ID}`)).toBeInTheDocument();
    });

    expect(r.getByText(/service.laboratory/i)).toBeInTheDocument();
    expect(r.getByText(/button.perform/i)).toBeInTheDocument();
    expect(r.getByText(/service.addLabTest/i)).toBeInTheDocument();
    expect(r.getByText(/service.labOrderNum/i)).toBeInTheDocument();
    //skip because hidden functionality
    //expect(r.getByTestId('laboratoryCardOpenLabOrderModal')).toBeInTheDocument();
    //expect(r.getByTestId('laboratoryCardDeleteLabOrder')).toBeInTheDocument();

    /*   await user.click(r.getByTestId('laboratoryCardOpenLabOrderModal'));
    await waitFor(() => {
      expect(r.queryByTestId(`labCreationModal`)).toBeInTheDocument();
    });*/
  });
});
