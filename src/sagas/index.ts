import { all } from 'redux-saga/effects';
import { initSagaTakeEvery } from './initSaga';
import { userSagaWatcher } from './userSaga';
import { patientSagaWatcher } from './patientSaga';
import { notificationsSagaWatcher } from './notificationsSaga';
import { overviewPatientsSagaWatcher } from './overviewPatientSaga';
import { hdPrescriptionSagaWatcher } from './hdPrescriptionSaga';
import { medicationSagaWatcher } from './medicationsSaga';
import { todayPatientsSagaWatcher } from './todayPatientsSaga';
import { dialysisSagaWatcher } from './dialysisSaga';
import { systemSagaTakeEvery } from './systemSaga';
import { labOrdersSagaWatcher } from './labOrdersSaga';
import { vascularAccessReportsSagaWatcher } from './reports/vascularAccessReportsSaga';
import { labResultsSagaWatcher } from './labResultsSaga';
import { clinicalNotesSagaWatcher } from '@sagas/clinicalNotesSaga';
import { accessManagementSagaWatcher } from '@sagas/accessManagement';
import { patientCensusReportsSagaWatcher } from '@sagas/reports/patientCensusReportSaga';
import { drawerSagaWatcher } from '@sagas/drawerSaga';
import { patientsScheduleSagaWatcher } from '@sagas/schedules/patientsSchedule';
import { clinicalScheduleSagaWatcher } from '@sagas/schedules/clinicalSchedule';
import { vaccinationSagaWatcher } from '@sagas/vaccinationSaga';
import { dialysisMachinesSagaWatcher } from '@sagas/dialysisMachinesSaga';
import { staffUserSagaWatcher } from '@sagas/staffUserSaga';
import { staffManagementWatcher } from '@sagas/staffManagementSaga';
import { mortalityReportsSagaWatcher } from '@sagas/reports/mortalityReportsSaga';
import { injectionReportsSagaWatcher } from '@sagas/reports/injectionReportsSaga';
import { hospitalizationReportsSagaWatcher } from '@sagas/reports/hospitalizationReportsSaga';
import { patientStationHistoryReportSagaWatcher } from '@sagas/reports/patientStationHistoryReportSaga';
import { dialyzerSagaWatcher } from '@sagas/dialyzerSaga';
import { virologySagaWatcher } from '@sagas/virologySaga';

export default function* rootSaga() {
  yield all([
    systemSagaTakeEvery(),
    initSagaTakeEvery(),
    userSagaWatcher(),
    patientSagaWatcher(),
    notificationsSagaWatcher(),
    overviewPatientsSagaWatcher(),
    hdPrescriptionSagaWatcher(),
    medicationSagaWatcher(),
    todayPatientsSagaWatcher(),
    dialysisSagaWatcher(),
    labOrdersSagaWatcher(),
    vascularAccessReportsSagaWatcher(),
    labResultsSagaWatcher(),
    clinicalNotesSagaWatcher(),
    accessManagementSagaWatcher(),
    patientCensusReportsSagaWatcher(),
    drawerSagaWatcher(),
    patientsScheduleSagaWatcher(),
    vaccinationSagaWatcher(),
    dialysisMachinesSagaWatcher(),
    staffUserSagaWatcher(),
    staffManagementWatcher(),
    mortalityReportsSagaWatcher(),
    hospitalizationReportsSagaWatcher(),
    injectionReportsSagaWatcher(),
    patientStationHistoryReportSagaWatcher(),
    clinicalScheduleSagaWatcher(),
    dialyzerSagaWatcher(),
    virologySagaWatcher(),
  ]);
}
