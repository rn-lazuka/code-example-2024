import type { Action } from 'redux';
import type { LabOrdersChipCountersResponse, LabOrdersContent, LabOrdersResponse } from '@types';
import { runSagaHandler } from '@unit-tests';
import { getLabOrdersListSaga } from '@sagas/labOrdersSaga';
import {
  addLabOrdersError,
  getFilteredLabOrdersList,
  labOrderInitialState,
  removeDrawer,
  setLabOrdersStatusChips,
  updateLabOrdersListSuccess,
} from '@store/slices';
import { DrawerType, ServiceModalName } from '@enums';
import { server } from '@unit-tests/server/serverMock';
import { rest } from 'msw';
import { labOrderContentFixture, labOrderStatusCountersFixture } from '@unit-tests/fixtures';
import { setStatusChipCount } from '@utils';

describe('Lab Orders Saga tests', () => {
  afterAll(() => jest.clearAllMocks());

  const responseMock: LabOrdersResponse = {
    content: [labOrderContentFixture()],
    totalPages: 20,
    size: 50,
    number: 1,
    sort: {
      empty: true,
      sorted: true,
      unsorted: true,
    },
    pageable: {
      pageNumber: 1,
      pageSize: 20,
      paged: true,
      offset: 20,
      unpaged: true,
      sort: {
        empty: true,
        sorted: true,
        unsorted: true,
      },
    },
    numberOfElements: 1000,
    first: false,
    last: false,
    empty: false,
    totalElements: 1000,
  };

  const countResponseMock: LabOrdersChipCountersResponse = labOrderStatusCountersFixture();

  describe('getLabOrdersListSaga', () => {
    it('should correctly map data from store and fetch lab orders, with initial filters and without appointment id', async () => {
      server.use(
        rest.post(`${process.env.DEVELOPMENT_API_TARGET}/pm/lab-orders/search`, (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(responseMock));
        }),
        rest.post(`${process.env.DEVELOPMENT_API_TARGET}/pm/lab-orders/count`, (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(countResponseMock));
        }),
      );

      const dispatched: Action[] = [];
      await runSagaHandler(
        dispatched,
        {
          labOrders: {
            filters: labOrderInitialState.filters,
            statusFilters: labOrderInitialState.statusFilters,
            pagination: labOrderInitialState.pagination,
            sortBy: labOrderInitialState.sortBy,
            sortDir: labOrderInitialState.sortDir,
          },
          serviceModal: {
            [ServiceModalName.DialysisProcedureModal]: {},
          },
        },
        getLabOrdersListSaga,
        {
          type: getFilteredLabOrdersList.type,
        },
      );

      expect(dispatched).toEqual([
        updateLabOrdersListSuccess({
          content: responseMock.content as LabOrdersContent[],
          pagination: {
            currentPage: responseMock.pageable.pageNumber,
            perPage: responseMock.pageable.pageSize,
            totalCount: responseMock.totalElements,
          },
        }),
        setLabOrdersStatusChips(
          labOrderInitialState.statusFilters.map((filter) => ({
            ...filter,
            badge: setStatusChipCount(filter.name, countResponseMock),
          })),
        ),
        removeDrawer(DrawerType.LabOrdersFilters),
      ]);
    });

    it('should correctly map data from store and fetch lab orders, with filled filters and with appointment id', async () => {
      server.use(
        rest.post(`${process.env.DEVELOPMENT_API_TARGET}/pm/lab-orders/search`, (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(responseMock));
        }),
        rest.post(`${process.env.DEVELOPMENT_API_TARGET}/pm/lab-orders/count`, (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(countResponseMock));
        }),
      );

      const selectedFiltersMock = {
        from: labOrderInitialState.filters.from,
        to: labOrderInitialState.filters.to,
        patient: { id: '1', label: 'Test Name' },
        appointmentId: '2',
        procedures: [{ label: 'Test', value: 'test value' }],
        labIds: ['Test lab id'],
        order: { id: '3', label: 'Test label' },
        shifts: [{ label: 'Test label', value: '1' }],
      };
      const serviceModalDataMock = { appointmentId: '5' };
      const dispatched: Action[] = [];

      await runSagaHandler(
        dispatched,
        {
          labOrders: {
            filters: selectedFiltersMock,
            statusFilters: labOrderInitialState.statusFilters,
            pagination: labOrderInitialState.pagination,
            sortBy: labOrderInitialState.sortBy,
            sortDir: labOrderInitialState.sortDir,
          },
          serviceModal: {
            [ServiceModalName.DialysisProcedureModal]: serviceModalDataMock,
          },
        },
        getLabOrdersListSaga,
        {
          type: getFilteredLabOrdersList.type,
        },
      );

      expect(dispatched).toEqual([
        updateLabOrdersListSuccess({
          content: responseMock.content as LabOrdersContent[],
          pagination: {
            currentPage: responseMock.pageable.pageNumber,
            perPage: responseMock.pageable.pageSize,
            totalCount: responseMock.totalElements,
          },
        }),
        setLabOrdersStatusChips(
          labOrderInitialState.statusFilters.map((filter) => ({
            ...filter,
            badge: setStatusChipCount(filter.name, countResponseMock),
          })),
        ),
        removeDrawer(DrawerType.LabOrdersFilters),
      ]);
    });

    it('should correctly handle error', async () => {
      server.use(
        rest.post(`${process.env.DEVELOPMENT_API_TARGET}/pm/lab-orders/search`, (req, res, ctx) => {
          return res.once(ctx.status(500));
        }),
      );

      const dispatched: Action[] = [];

      await runSagaHandler(
        dispatched,
        {
          labOrders: {
            filters: labOrderInitialState.filters,
            statusFilters: labOrderInitialState.statusFilters,
            pagination: labOrderInitialState.pagination,
            sortBy: labOrderInitialState.sortBy,
            sortDir: labOrderInitialState.sortDir,
          },
          serviceModal: {
            [ServiceModalName.DialysisProcedureModal]: {},
          },
        },
        getLabOrdersListSaga,
        {
          type: getFilteredLabOrdersList.type,
        },
      );
      expect(dispatched).toEqual([{ type: addLabOrdersError.type, payload: expect.any(Error) }]);
    });
  });

  // describe.skip('labOrdersCrudSuccessSaga', () => {
  //   it('should call all needed actions, when lab order was updated etc. (but not created)', async () => {
  //     const dispatched: Action[] = [];
  //
  //     await runSagaHandler(dispatched, {}, labOrdersCrudSuccessSaga, {
  //       type: updateLabOrderSuccess.type,
  //       payload: { type: updateLabOrderSuccess.type },
  //     });
  //
  //     expect(dispatched).toEqual([
  //       removeServiceModal(ServiceModalName.LabCreationModal),
  //       resetLabOrdersCreation(),
  //       updateLabOrdersList(),
  //     ]);
  //   });
  // });
  //
  // describe.skip('labOrdersCrudSaga', () => {
  //   const LabOrderForEditingMock: LabOrderForEditingResponse = {
  //     id: 123,
  //     patientId: 456,
  //     patientName: 'John Smith',
  //     appointmentId: 789,
  //     labId: 1,
  //     labName: 'Lab 1',
  //     procedureId: 2,
  //     procedureName: 'Procedure 2',
  //     sampledAt: '2023-02-23T10:00:00.000Z',
  //     priority: LabPriority.ROUTINE,
  //     mealStatus: LabMealStatus.NON_FASTING,
  //     specimenType: LabSpecimenType.BLOOD,
  //     status: LabOrderStatus.PENDING,
  //     number: 'LO-123',
  //   };
  //   it.skip(`should correctly handle case when type equals 'createLabOrder.type' and API response contains appointmentId`, async () => {
  //     const mockPatientAppointment: PatientAppointmentResponse = {
  //       appointmentId: 123,
  //       dialysisId: 456,
  //       status: DialysisStatus.PreDialysis,
  //       date: '2023-02-23',
  //       startTime: '08:00',
  //       endTime: '09:00',
  //       bay: 'Bay 1',
  //       previousSkipped: false,
  //       patient: {
  //         name: 'John',
  //         id: '1',
  //       },
  //       isolationGroup: {
  //         id: 1,
  //         isolations: [],
  //         name: 'Isolation Group 1',
  //       },
  //     };
  //     server.use(
  //       rest.get(
  //         `${process.env.DEVELOPMENT_API_TARGET}/pm/patients/:patientId/appointments/summary`,
  //         (req, res, ctx) => {
  //           return res.once(ctx.status(200), ctx.json(mockPatientAppointment));
  //         },
  //       ),
  //     );
  //     server.use(
  //       rest.post(`${process.env.DEVELOPMENT_API_TARGET}/pm/lab-orders`, (req, res, ctx) => {
  //         return res.once(ctx.status(200), ctx.json(LabOrderForEditingMock));
  //       }),
  //     );
  //     const dispatched: Action[] = [];
  //
  //     await runSagaHandler(
  //       dispatched,
  //       {
  //         serviceModal: {
  //           [ServiceModalName.LabCreationModal]: {},
  //         },
  //         dialysis: { appointmentId: '5' },
  //         labOrders: { order: {} },
  //       },
  //       labOrdersCrudSaga,
  //       {
  //         type: createLabOrder.type,
  //         payload: LabOrderForEditingMock,
  //       },
  //     );
  //     expect(dispatched).toEqual([
  //       createLabOrderSuccess(LabOrderForEditingMock),
  //       removeDrawer(DrawerType.LabOrderForm),
  //       { type: resetLabOrdersCreation.type },
  //     ]);
  //   });
  //
  //   it.skip(`should correctly handle case when type equals 'createLabOrder.type' and API response not contains appointmentId`, async () => {
  //     const payloadMock = { patientId: '2', orderData: {}, samplingTime: 'Test Date' };
  //     server.use(
  //       rest.get(
  //         `${process.env.DEVELOPMENT_API_TARGET}/pm/patients/:patientId/appointments/summary`,
  //         (req, res, ctx) => {
  //           return res.once(ctx.status(200), ctx.json({}));
  //         },
  //       ),
  //     );
  //     const dispatched: Action[] = [];
  //
  //     await runSagaHandler(
  //       dispatched,
  //       {
  //         serviceModal: {
  //           [ServiceModalName.LabCreationModal]: {},
  //         },
  //         dialysis: { appointmentId: '5' },
  //         labOrders: { order: {} },
  //       },
  //       labOrdersCrudSaga,
  //       {
  //         type: createLabOrder.type,
  //         payload: payloadMock,
  //       },
  //     );
  //
  //     expect(JSON.stringify(dispatched)).toEqual(
  //       JSON.stringify([
  //         addServiceModal({
  //           name: ServiceModalName.ConfirmModal,
  //           payload: {
  //             closeCallback: () => put(setLabOrderCannotBeCreated(false)),
  //             title: i18n.t('labOrders:forms.creation.cannotBeCreated'),
  //             text: i18n.t('labOrders:forms.creation.thereIsNoHdAppointmentToday'),
  //             confirmButton: i18n.t('common:button.ok').toUpperCase(),
  //             cancelButton: null,
  //           },
  //         }),
  //         removeDrawer(DrawerType.LabOrderForm),
  //         { type: resetLabOrdersCreation.type },
  //       ]),
  //     );
  //   });
  //
  //   it.skip(`should correctly handle error, when type equals 'createLabOrder.type'`, async () => {
  //     const payloadMock = { patientId: '2', orderData: {}, samplingTime: 'Test Date' };
  //
  //     server.use(
  //       rest.get(
  //         `${process.env.DEVELOPMENT_API_TARGET}/pm/patients/:patientId/appointments/summary`,
  //         (req, res, ctx) => {
  //           return res.once(ctx.status(400));
  //         },
  //       ),
  //     );
  //     const dispatched: Action[] = [];
  //
  //     await runSagaHandler(
  //       dispatched,
  //       {
  //         serviceModal: {
  //           [ServiceModalName.LabCreationModal]: {},
  //         },
  //         dialysis: { appointmentId: '5' },
  //         labOrders: { order: {} },
  //       },
  //       labOrdersCrudSaga,
  //       {
  //         type: createLabOrder.type,
  //         payload: payloadMock,
  //       },
  //     );
  //
  //     expect(dispatched).toEqual([{ type: addLabOrdersError.type, payload: expect.any(Error) }]);
  //   });
  //
  //   it.skip(`should correctly handle case when type equals ${readLabOrder.type}`, async () => {
  //     server.use(
  //       rest.get(`${process.env.DEVELOPMENT_API_TARGET}/pm/lab-orders/:id`, (req, res, ctx) => {
  //         return res.once(ctx.status(200), ctx.json(LabOrderForEditingMock));
  //       }),
  //     );
  //     const dispatched: Action[] = [];
  //
  //     await runSagaHandler(
  //       dispatched,
  //       {
  //         serviceModal: {
  //           [ServiceModalName.LabCreationModal]: {},
  //         },
  //         dialysis: { appointmentId: '5' },
  //         labOrders: { order: {} },
  //       },
  //       labOrdersCrudSaga,
  //       {
  //         type: readLabOrder.type,
  //         payload: 1,
  //       },
  //     );
  //
  //     expect(dispatched).toEqual([readLabOrderSuccess(LabOrderForEditingMock)]);
  //   });
  //
  //   it.skip(`should correctly handle error, when type equals ${readLabOrder.type}`, async () => {
  //     server.use(
  //       rest.get(`${process.env.DEVELOPMENT_API_TARGET}/pm/lab-orders/:id`, (req, res, ctx) => {
  //         return res.once(ctx.status(400));
  //       }),
  //     );
  //     const dispatched: Action[] = [];
  //
  //     await runSagaHandler(
  //       dispatched,
  //       {
  //         serviceModal: {
  //           [ServiceModalName.LabCreationModal]: {},
  //         },
  //         dialysis: { appointmentId: '5' },
  //         labOrders: { order: {} },
  //       },
  //       labOrdersCrudSaga,
  //       {
  //         type: readLabOrder.type,
  //         payload: 1,
  //       },
  //     );
  //
  //     expect(dispatched).toEqual([{ type: addLabOrdersError.type, payload: expect.any(Error) }]);
  //   });
  // });
});
