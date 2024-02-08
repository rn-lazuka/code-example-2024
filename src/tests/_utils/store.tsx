import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { Action } from 'redux';
import createSagaMiddleware, { runSaga, Saga } from 'redux-saga';
import rootSaga from '../../sagas';
import accessManagementReducer from '../../store/slices/accessManagementSlice';
import clinicalNotesReducer from '../../store/slices/clinicalNotesSlice';
import dialysisMachinesReducer from '../../store/slices/dialysisMachines';
import dialysisReducer from '../../store/slices/dialysisSlice';
import dialyzerReducer from '../../store/slices/dialyzerSlice';
import drawerReducer from '../../store/slices/drawerSlice';
import hdPrescriptionsReducer from '../../store/slices/hdPrescriptionSlice';
import initReducer from '../../store/slices/initSlice';
import labOrdersReducer from '../../store/slices/labOrdersSlice';
import labResultsReducer from '../../store/slices/labResultsSlice';
import medicationsReducer from '../../store/slices/medicationSlice';
import notificationReducer from '../../store/slices/notificationSlice';
import overviewPatientsReducer from '../../store/slices/overviewPatientsSlice';
import patientReducer from '../../store/slices/patientSlice';
import hospitalizationReportsReducer from '../../store/slices/reports/hospitalizationReportsSlice';
import injectionReportsReducer from '../../store/slices/reports/injectionReportsSlice';
import mortalityReportsReducer from '../../store/slices/reports/mortalityReportsSlice';
import patientCensusReportReducer from '../../store/slices/reports/patientCensusReportsSlice';
import patientStationHistoryReportReducer from '../../store/slices/reports/patientStationHistorySlice';
import vascularAccessReportsReducer from '../../store/slices/reports/vascularAccessReportsSlice';
import clinicalScheduleReducer from '../../store/slices/schedules/clinicalScheduleSlice';
import patientsScheduleReducer from '../../store/slices/schedules/patientsScheduleSlice';
import serviceModalReducer from '../../store/slices/serviceModalSlice';
import snackReducer from '../../store/slices/snackSlice';
import systemReducer from '../../store/slices/systemSlice';
import todayPatientsReducer from '../../store/slices/todayPatientsSlice';
import userReducer from '../../store/slices/userSlice';
import vaccinationReducer from '../../store/slices/vaccinationSlice';

const sagaMiddleware = createSagaMiddleware();

export function getTestStore(preloadedState) {
  const store = configureStore({
    reducer: combineReducers({
      system: systemReducer,
      user: userReducer,
      patient: patientReducer,
      overviewPatients: overviewPatientsReducer,
      hdPrescriptions: hdPrescriptionsReducer,
      todayPatients: todayPatientsReducer,
      init: initReducer,
      snack: snackReducer,
      notification: notificationReducer,
      drawer: drawerReducer,
      medications: medicationsReducer,
      vaccination: vaccinationReducer,
      serviceModal: serviceModalReducer,
      dialysis: dialysisReducer,
      labOrders: labOrdersReducer,
      vascularAccessReports: vascularAccessReportsReducer,
      patientCensusReport: patientCensusReportReducer,
      labResults: labResultsReducer,
      clinicalNotes: clinicalNotesReducer,
      accessManagement: accessManagementReducer,
      patientsSchedule: patientsScheduleReducer,
      dialysisMachines: dialysisMachinesReducer,
      mortalityReports: mortalityReportsReducer,
      injectionReports: injectionReportsReducer,
      hospitalizationReports: hospitalizationReportsReducer,
      patientStationHistoryReport: patientStationHistoryReportReducer,
      clinicalSchedule: clinicalScheduleReducer,
      dialyzer: dialyzerReducer,
    }),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        thunk: false,
      }).concat(sagaMiddleware),
    preloadedState,
  });
  sagaMiddleware.run(rootSaga);
  return store;
}

export const getTestStoreAndDispatch = (preloadedState, passToTheOriginalDispatch = false) => {
  const store = getTestStore(preloadedState);
  const originalDispatch = store.dispatch;
  const mockDispatch = jest.fn().mockImplementation((action) => {
    passToTheOriginalDispatch && originalDispatch(action);
  });

  store.dispatch = mockDispatch;

  return {
    store,
    originalDispatch,
    dispatch: mockDispatch,
  };
};

export const runSagaHandler = (dispatched, state, saga, ...args) => {
  return runSaga(
    {
      dispatch: (action) => dispatched.push(action as Action),
      getState: () => state,
    },
    saga as Saga,
    ...args,
  ).toPromise();
};
