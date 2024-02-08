import {
  HospitalizationReportCountersResponse,
  HospitalizationReportFilters,
  HospitalizationResponseContentItem,
} from '@types';
import { PatientHospitalizationReason } from '@enums';
import i18n from 'i18next';

export const setHospitalizationReasonsBadges = (
  data: HospitalizationReportCountersResponse,
  filters: HospitalizationReportFilters,
): HospitalizationReportFilters => {
  const setBadge = (name: PatientHospitalizationReason): number => {
    switch (name) {
      case PatientHospitalizationReason.UNKNOWN:
        return data.unknown;
      case PatientHospitalizationReason.VASCULAR_RELATED:
        return data.vascularRelated;
      case PatientHospitalizationReason.HD_RELATED:
        return data.hdRelated;
      case PatientHospitalizationReason.NON_HD_RELATED:
        return data.nonHdRelated;
      default:
        return 0;
    }
  };

  return {
    ...filters,
    reasons: filters.reasons.map((reason) => ({ ...reason, badge: setBadge(reason.name).toString() })),
  };
};

export const convertHospitalizationReportDataToTableFormat = (data: HospitalizationResponseContentItem[]) => {
  return data.map((item) => ({ ...item, reason: i18n.t(`reports:filters.${item.reason}`) }));
};
