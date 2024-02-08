import { lazy, PropsWithChildren, Suspense, useEffect } from 'react';
import { selectServiceModals } from '@store';
import { ServiceModalName } from '@enums';

const DialysisProcedureModal = lazy(() => import('./components/DialysisProcedureModal/DialysisProcedureModal'));
const PatientChangeStatusModal = lazy(() => import('./components/PatientChangeStatusModal/PatientChangeStatusModal'));
const VaccineAdministeringModal = lazy(
  () => import('./components/VaccineMedicationAdministeringModal/VaccineMedicationAdministeringModal'),
);
const GlobalConfirmModal = lazy(() => import('./components/GlobalConfirmModal/GlobalConfirmModal'));
const SkipAppointmentModal = lazy(() => import('./components/SkipAppointmentModal/SkipAppointmentModal'));
const EnterLabResultModal = lazy(() => import('./components/EnterLabResultsModal/EnterLabResultsModal'));
const LabResultAttachFileModal = lazy(() => import('./components/LabResultAttachFileModal/LabResultAttachFileModal'));
const SystemInfoModal = lazy(() => import('./components/SystemInfoModal/SystemInfoModal'));
const RescheduleModal = lazy(() => import('./components/RescheduleModal/RescheduleModal'));
const AddClinicalEventModal = lazy(() => import('./components/AddClinicalEventModal/AddClinicalEventModal'));
const UrgentLabTestModal = lazy(() => import('./components/UrgentLabTestModal/UrgentLabTestModal'));
const PerformLabTestModal = lazy(() => import('./components/PerformLabTestModal/PerformLabTestModal'));
const AddHocServicesModal = lazy(
  () => import('@components/modals/ServiceModal/components/AddHocServicesModal/AddHocServicesModal'),
);
const ShowHdParamsModal = lazy(() => import('./components/ShowHdParamsModal/ShowHdParamsModal'));
const RescheduleLabTestModal = lazy(() => import('./components/RescheduleLabTestModal/RescheduleLabTestModal'));
const OmitLabTestModal = lazy(() => import('./components/OmitLabTestModal/OmitLabTestModal'));
const PerformAndOmitDoctorsReviewModal = lazy(
  () =>
    import(
      '@components/modals/ServiceModal/components/PerformAndOmitDoctorsReviewModal/PerformAndOmitDoctorsReviewModal'
    ),
);
const AddDialyzerModal = lazy(() => import('./components/AddDialyzerModal/AddDialyzerModal'));
const ServicesSummaryModal = lazy(() => import('./components/ServicesSummaryModal/ServicesSummaryModal'));

const ModalSuspense = ({ children }: PropsWithChildren<{}>) => {
  return <Suspense fallback={<div />}>{children}</Suspense>;
};
export const ServiceModal = () => {
  const modals = selectServiceModals();
  let modalIndex = 1200;
  const getModalComponentByName = (modalName) => {
    modalIndex += 1;
    switch (modalName) {
      case ServiceModalName.DialysisProcedureModal:
        return (
          <ModalSuspense key={modalName}>
            <DialysisProcedureModal index={modalIndex} />
          </ModalSuspense>
        );
      case ServiceModalName.PerformLabTest:
        return (
          <ModalSuspense key={modalName}>
            <PerformLabTestModal index={modalIndex} />
          </ModalSuspense>
        );
      case ServiceModalName.UrgentLabTest:
        return (
          <ModalSuspense key={modalName}>
            <UrgentLabTestModal index={modalIndex} />
          </ModalSuspense>
        );
      case ServiceModalName.ConfirmModal:
        return (
          <ModalSuspense key={modalName}>
            <GlobalConfirmModal index={modalIndex} />
          </ModalSuspense>
        );
      case ServiceModalName.VaccineMedicationAdministeringModal:
        return (
          <ModalSuspense key={modalName}>
            <VaccineAdministeringModal index={modalIndex} />
          </ModalSuspense>
        );
      case ServiceModalName.PatientStatusModal:
        return (
          <ModalSuspense key={modalName}>
            <PatientChangeStatusModal index={modalIndex} />
          </ModalSuspense>
        );
      case ServiceModalName.EnterLabResultModal:
        return (
          <ModalSuspense key={modalName}>
            <EnterLabResultModal index={modalIndex} />
          </ModalSuspense>
        );
      case ServiceModalName.SkipAppointmentModal:
        return (
          <ModalSuspense key={modalName}>
            <SkipAppointmentModal index={modalIndex} />
          </ModalSuspense>
        );
      case ServiceModalName.AttachFileModal:
        return (
          <ModalSuspense key={modalName}>
            <LabResultAttachFileModal index={modalIndex} />
          </ModalSuspense>
        );
      case ServiceModalName.SystemInfoModal:
        return (
          <ModalSuspense key={modalName}>
            <SystemInfoModal index={1300} />
          </ModalSuspense>
        );
      case ServiceModalName.RescheduleModal:
        return (
          <ModalSuspense key={modalName}>
            <RescheduleModal index={modalIndex} />
          </ModalSuspense>
        );
      case ServiceModalName.AddClinicalEventModal:
        return (
          <ModalSuspense key={modalName}>
            <AddClinicalEventModal index={modalIndex} />
          </ModalSuspense>
        );
      case ServiceModalName.AddHocServicesModal:
        return (
          <ModalSuspense key={modalName}>
            <AddHocServicesModal index={modalIndex} />
          </ModalSuspense>
        );
      case ServiceModalName.ShowHdParamsModal:
        return (
          <ModalSuspense key={modalName}>
            <ShowHdParamsModal index={modalIndex} />
          </ModalSuspense>
        );
      case ServiceModalName.RescheduleLabTest:
        return (
          <ModalSuspense key={modalName}>
            <RescheduleLabTestModal index={modalIndex} />
          </ModalSuspense>
        );
      case ServiceModalName.OmitLabTest:
        return (
          <ModalSuspense key={modalName}>
            <OmitLabTestModal index={modalIndex} />
          </ModalSuspense>
        );
      case ServiceModalName.PerformAndOmitDoctorsReview:
        return (
          <ModalSuspense key={modalName}>
            <PerformAndOmitDoctorsReviewModal index={modalIndex} />
          </ModalSuspense>
        );
      case ServiceModalName.AddDialyzerModal:
        return (
          <ModalSuspense key={modalName}>
            <AddDialyzerModal index={modalIndex} />
          </ModalSuspense>
        );
      case ServiceModalName.ServicesSummaryModal:
        return (
          <ModalSuspense key={modalName}>
            <ServicesSummaryModal index={modalIndex} />
          </ModalSuspense>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (modals && !modals.length) {
      document.body.style.overflow = '';
    }
  }, [modals]);

  return <>{Object.keys(modals).map(getModalComponentByName)}</>;
};
