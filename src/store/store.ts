import createSagaMiddleware from 'redux-saga';
import { configureStore, combineReducers, Reducer } from '@reduxjs/toolkit';
import type { StoreWithDynamicReducers } from '@types';
import systemReducer from './slices/systemSlice';
import userReducer from './slices/userSlice';
import patientReducer from './slices/patientSlice';
import overviewPatientsReducer from './slices/overviewPatientsSlice';
import hdPrescriptionsReducer from './slices/hdPrescriptionSlice';
import todayPatientsReducer from './slices/todayPatientsSlice';
import initReducer from './slices/initSlice';
import snackReducer from './slices/snackSlice';
import notificationReducer from './slices/notificationSlice';
import drawerReducer from './slices/drawerSlice';
import medicationsReducer from './slices/medicationSlice';
import serviceModalReducer from './slices/serviceModalSlice';
import dialysisReducer from './slices/dialysisSlice';
import labOrdersReducer from './slices/labOrdersSlice';
import vascularAccessReportsReducer from './slices/reports/vascularAccessReportsSlice';
import patientCensusReportReducer from './slices/reports/patientCensusReportsSlice';
import labResultsReducer from './slices/labResultsSlice';
import clinicalNotesReducer from './slices/clinicalNotesSlice';
import accessManagementReducer from './slices/accessManagementSlice';
import patientsScheduleReducer from './slices/schedules/patientsScheduleSlice';
import clinicalScheduleReducer from './slices/schedules/clinicalScheduleSlice';
import vaccinationReducer from './slices/vaccinationSlice';
import dialysisMachinesReducer from './slices/dialysisMachines';
import staffManagementReducer from './slices/staffManagement';
import staffUserReducer from './slices/staffUserSlice';
import injectionReportsReducer from './slices/reports/injectionReportsSlice';
import mortalityReportsReducer from './slices/reports/mortalityReportsSlice';
import hospitalizationReportsReducer from './slices/reports/hospitalizationReportsSlice';
import patientStationHistoryReportReducer from './slices/reports/patientStationHistorySlice';
import dialyzerReducer from './slices/dialyzerSlice';
import virologyReducer from './slices/virologySlice';

export const reducers: { [key: string]: Reducer } = {
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
  mortalityReports: mortalityReportsReducer,
  injectionReports: injectionReportsReducer,
  hospitalizationReports: hospitalizationReportsReducer,
  patientStationHistoryReport: patientStationHistoryReportReducer,
  labResults: labResultsReducer,
  clinicalNotes: clinicalNotesReducer,
  accessManagement: accessManagementReducer,
  patientsSchedule: patientsScheduleReducer,
  clinicalSchedule: clinicalScheduleReducer,
  dialysisMachines: dialysisMachinesReducer,
  staffManagement: staffManagementReducer,
  staffUser: staffUserReducer,
  dialyzer: dialyzerReducer,
  virology: virologyReducer,
};

export const createDynamicReducer = (
  asyncReducers: { [key: string]: Reducer } = {},
): ReturnType<typeof combineReducers> => {
  return combineReducers({
    ...asyncReducers,
    ...reducers,
  });
};

export const reducer = combineReducers(reducers);

const sagaMiddleware = createSagaMiddleware();

const initStore = () => {
  const store: StoreWithDynamicReducers = configureStore({
    reducer: createDynamicReducer(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        thunk: false,
      }).concat(sagaMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  store.asyncReducers = {};
  store.injectReducer = (key: string, reducer: Reducer) => {
    store.asyncReducers[key] = reducer;
    store.replaceReducer(createDynamicReducer(store.asyncReducers));
    return store;
  };

  return store;
};

export const store = initStore();

export const runSaga = sagaMiddleware.run;
