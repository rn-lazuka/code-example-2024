import type { Column } from '@types';
import i18n from 'i18next';
import { BaseProgressBar } from '@components/BaseProgressBar/BaseProgressBar';
import { ServicesType } from '@enums/global/ServicesType';
import { DoctorReviewStatus } from '@components/ServicesStatus/DoctorReviewStatus';
import { VaccinationStatus } from '@components/ServicesStatus/VaccinationStatus';
import { MedicationStatus } from '@components/ServicesStatus/MedicationStatus';
import { LabOrderStatus } from '@components/ServicesStatus/LabOrderStatus';

export const getServicesSummaryTableColumns = (): Column[] => [
  {
    id: 'category',
    label: i18n.t('dialysis:category'),
    format: (value) => {
      switch (value) {
        case ServicesType.HAEMODIALYSIS:
          return i18n.t('dialysis:dialysisServices.hemodialysis.hemodialysis');
        case ServicesType.LAB_ORDER:
          return i18n.t('dialysis:dialysisServices.labTest');
        case ServicesType.MEDICATION:
          return i18n.t('dialysis:dialysisServices.mediation');
        case ServicesType.VACCINATION:
          return i18n.t('dialysis:dialysisServices.vaccination');
        case ServicesType.DOCTOR_NEPHROLOGIST_REVIEW:
          return i18n.t('dialysis:performDoctorsReview.nephrologistReview');
        case ServicesType.DOCTOR_PIC_REVIEW:
          return i18n.t('dialysis:performDoctorsReview.PICReview');
        default:
          return '';
      }
    },
  },
  {
    id: 'product',
    label: i18n.t('dialysis:product'),
  },
  {
    id: 'amount',
    label: i18n.t('dialysis:amount'),
  },
  {
    id: 'status',
    label: i18n.t('dialysis:status'),
    width: 190,
    minWidth: 190,
    format: (value, fullData) => {
      switch (fullData.category) {
        case ServicesType.HAEMODIALYSIS:
          return <BaseProgressBar current={100} label={''} finished />;
        case ServicesType.LAB_ORDER:
          return <LabOrderStatus status={value} />;
        case ServicesType.MEDICATION:
          return <MedicationStatus status={value} />;
        case ServicesType.VACCINATION:
          return <VaccinationStatus status={value} />;
        case ServicesType.DOCTOR_NEPHROLOGIST_REVIEW:
        case ServicesType.DOCTOR_PIC_REVIEW:
          return <DoctorReviewStatus status={value} />;
        default:
          return '';
      }
    },
  },
];
