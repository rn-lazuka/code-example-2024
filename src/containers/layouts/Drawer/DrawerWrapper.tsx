import { lazy, Suspense, useEffect } from 'react';
import { Drawer } from '@components';
import { removeDrawer, selectActiveDrawers, updateDrawer } from '@store/slices/drawerSlice';
import { DrawerFull } from '@types';
import { useAppDispatch } from '@hooks/storeHooks';
import i18n from 'i18next';
import {
  DrawerStatus,
  DrawerType,
  LabTestTypes,
  MedicationDrawerType,
  ServiceModalName,
  VaccinationDrawerType,
} from '@enums';
import { addServiceModal } from '@store/slices/serviceModalSlice';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '@constants';

const AddVaccinationForm = lazy(() => import('./components/AddVaccinationForm/AddVaccinationForm'));
const AddHdPrescriptionForm = lazy(() => import('./components/AddHdPrescriptionForm/AddHdPrescriptionForm'));
const HdSchedulingForm = lazy(() => import('./components/AddHdSchedulingForm/AddHdSchedulingForm'));
const AddMedicationForm = lazy(() => import('./components/AddMedicationForm/AddMedicationForm'));
const PatientsOverviewFilters = lazy(
  () => import('./components/PatientsOverviewDrawerFilters/PatientsOverviewDrawerFilters'),
);
const TodayPatientsDrawerFilters = lazy(
  () => import('./components/TodayPatientsDrawerFilters/TodayPatientsDrawerFilters'),
);
const AddClinicalNoteForm = lazy(() => import('./components/AddClinicalNoteForm/AddClinicalNoteForm'));
const AddAccessManagementForm = lazy(() => import('./components/AddAccessManagementForm/AddAccessManagementForm'));
const AddDialysisMachineForm = lazy(() => import('./components/AddDialysisMachineForm/AddDialysisMachineForm'));
const AddIndividualLabTestPlanForm = lazy(
  () => import('@containers/layouts/Drawer/components/AddIndividualLabTestPlanForm/AddIndividualLabTestPlanForm'),
);
const QuarterlyBTForm = lazy(
  () => import('@containers/layouts/Drawer/components/AddQuarterlyBTForm/AddQuarterlyBTForm'),
);
const LabOrdersFilters = lazy(
  () => import('@containers/layouts/Drawer/components/LabOrdersDrawerFilters/LabOrdersDrawerFilters'),
);

const getTitle = (type: DrawerType, drawerStatusType: any) => {
  switch (true) {
    case type === DrawerType.HdPrescriptionForm:
      return i18n.t(`hdPrescription:form.title`);
    case type === DrawerType.Medication && drawerStatusType === MedicationDrawerType.Confirm:
      return i18n.t(`medications:form.confirmTitle`);
    case type === DrawerType.Medication && drawerStatusType === MedicationDrawerType.Edit:
      return i18n.t(`medications:form.editTitle`);
    case type === DrawerType.Medication && drawerStatusType === MedicationDrawerType.Change:
      return i18n.t(`medications:form.changeTitle`);
    case type === DrawerType.Medication:
      return i18n.t(`medications:form.title`);
    case type === DrawerType.VaccinationForm && drawerStatusType === VaccinationDrawerType.Add:
      return i18n.t(`vaccination:form.vaccineAdding`);
    case type === DrawerType.VaccinationForm && drawerStatusType === VaccinationDrawerType.Edit:
      return i18n.t(`vaccination:form.vaccineEditing`);
    case type === DrawerType.PatientsOverviewFilters:
    case type === DrawerType.TodayPatientsFilters:
      return i18n.t('common:filters');
    case type === DrawerType.ClinicalNotesForm:
      return i18n.t(`clinicalNotes:clinicalNote`);
    case type === DrawerType.AccessManagementForm:
      return i18n.t('accessManagement:accessManagement');
    case type === DrawerType.HdScheduling:
      return i18n.t('hdPrescription:form.hdScheduling');
    case type === DrawerType.DialysisMachineForm:
      return i18n.t('dialysisMachines:form.title');
    case type === DrawerType.IndividualLabTestPlanForm:
      return i18n.t(`labOrders:labTestTypes.${LabTestTypes.Individual}`);
    case type === DrawerType.QuarterlyBT:
      return i18n.t('labOrders:quarterlyBTPlan');
    case type === DrawerType.LabOrdersFilters:
      return i18n.t('common:filters');
    default:
      return '';
  }
};

const getContent = (type: DrawerType) => {
  switch (true) {
    case type === DrawerType.HdPrescriptionForm:
      return (
        <Suspense fallback={<div></div>}>
          <AddHdPrescriptionForm />
        </Suspense>
      );
    case type === DrawerType.Medication:
      return (
        <Suspense fallback={<div></div>}>
          <AddMedicationForm />
        </Suspense>
      );
    case type === DrawerType.VaccinationForm:
      return (
        <Suspense fallback={<div></div>}>
          <AddVaccinationForm />
        </Suspense>
      );
    case type === DrawerType.PatientsOverviewFilters:
      return (
        <Suspense fallback={<div></div>}>
          <PatientsOverviewFilters />
        </Suspense>
      );
    case type === DrawerType.TodayPatientsFilters:
      return (
        <Suspense fallback={<div></div>}>
          <TodayPatientsDrawerFilters />
        </Suspense>
      );
    case type === DrawerType.ClinicalNotesForm:
      return (
        <Suspense fallback={<div></div>}>
          <AddClinicalNoteForm />
        </Suspense>
      );
    case type === DrawerType.AccessManagementForm:
      return (
        <Suspense fallback={<div></div>}>
          <AddAccessManagementForm />
        </Suspense>
      );
    case type === DrawerType.HdScheduling:
      return (
        <Suspense fallback={<div></div>}>
          <HdSchedulingForm />
        </Suspense>
      );
    case type === DrawerType.DialysisMachineForm:
      return (
        <Suspense fallback={<div></div>}>
          <AddDialysisMachineForm />
        </Suspense>
      );
    case type === DrawerType.IndividualLabTestPlanForm:
      return (
        <Suspense fallback={<div></div>}>
          <AddIndividualLabTestPlanForm />
        </Suspense>
      );
    case type === DrawerType.QuarterlyBT:
      return (
        <Suspense fallback={<div></div>}>
          <QuarterlyBTForm />
        </Suspense>
      );
    case type === DrawerType.LabOrdersFilters:
      return (
        <Suspense fallback={<div></div>}>
          <LabOrdersFilters />
        </Suspense>
      );
    default:
      return null;
  }
};

export const DrawerWrapper = () => {
  const drawers = selectActiveDrawers();
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    const mainPath = location.pathname.split('/')[1];

    (Object.keys(drawers) as DrawerType[]).forEach((type) => {
      const drawer = drawers[type]!;
      const allowedPaths = drawer.allowedPathsToShowDrawer || [];

      if (
        !allowedPaths.includes(mainPath) ||
        (allowedPaths.includes(mainPath) && location.pathname === `/${ROUTES.patientsOverview}`)
      ) {
        dispatch(removeDrawer(type));
      }
    });
  }, [location.pathname]);

  const onChangeStatusProxy = (type: DrawerType, newStatus: DrawerStatus) => {
    if (newStatus === DrawerStatus.Hidden) {
      const isDirty = drawers[type]!.statuses?.isDirty;
      const closeCallback = () => dispatch(removeDrawer(type));
      if (isDirty) {
        dispatch(
          addServiceModal({
            name: ServiceModalName.ConfirmModal,
            payload: { closeCallback },
          }),
        );
      } else {
        closeCallback();
      }
    } else {
      dispatch(updateDrawer({ type, status: newStatus }));
    }
  };

  return (
    <>
      {(Object.keys(drawers) as DrawerType[]).map((type: DrawerType, index) => {
        const drawer: DrawerFull = drawers[type]!;
        const drawerCustomTitle = drawer?.customTitle;
        const drawerCustomContent = drawer?.customContent;

        return (
          <Drawer
            key={type}
            status={drawer.status}
            nextStatus={drawer.nextStatus}
            title={drawerCustomTitle || getTitle(type, drawer.payload?.type)}
            onChangeStatus={(status) => onChangeStatusProxy(type, status)}
            collapsable={drawer.collapsable}
            index={index}
          >
            {drawerCustomContent || getContent(type)}
          </Drawer>
        );
      })}
    </>
  );
};
