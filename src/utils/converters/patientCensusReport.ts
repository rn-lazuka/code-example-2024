import type {
  PatientCensusReportContent,
  PatientCensusFilters,
  PatientCensusFiltersChipsCountersPayload,
} from '@types';
import { getCodeValueFromCatalog } from '@utils/getOptionsListFormCatalog';
import { format } from 'date-fns';
import { setValueFromCatalog } from '@utils/converters/vascularAccessReports';
import { PatientCensusIsolationFilter, PatientCensusStatusFilter } from '@enums';
import { getTimeFromDate } from '@utils';
import isEmpty from 'lodash/isEmpty';

export const convertPatientCensusDataToTableFormat = (data: PatientCensusReportContent[]) => {
  return data.map(
    ({
      address,
      bornAt,
      clinicalInfo,
      treatmentReferral,
      createdAt,
      status,
      modifiedAt,
      previousStatus,
      name,
      patientId,
      gender,
      race,
      religion,
      ...patientInfo
    }) => {
      const virusKeys = clinicalInfo && Object.keys(clinicalInfo);
      const virology = virusKeys
        ? virusKeys.filter((virology) => virology !== 'diagnosis' && clinicalInfo[virology] === 'reactive')
        : [];
      const districtText = address.district?.length ? ', ' + address.district : '';
      const stateText = address.state?.length ? ', ' + address.state : '';

      return {
        ...patientInfo,
        patient: { name, id: patientId },
        address: address
          ? `${address.houseFlat}, ${address.street}, ${
              address.city
            }${districtText}${stateText}, ${getCodeValueFromCatalog('country', address.countryIso)}, ${
              address.postalCode
            }`
          : '',
        age: getTimeFromDate(bornAt, 'm', false) ?? '—',
        gender: setValueFromCatalog('gender', gender),
        race: setValueFromCatalog('race', race),
        religion: setValueFromCatalog('religion', religion),
        diagnosis: clinicalInfo?.diagnosis,
        virology,
        treatmentReferral: isEmpty(treatmentReferral)
          ? ''
          : `${treatmentReferral?.doctor || '—'} / ${treatmentReferral?.clinic || '—'}`,
        createdAt: createdAt ? format(new Date(createdAt), 'dd/MM/yyyy') : '',
        status: setValueFromCatalog('patientStatuses', status),
        modifiedAt: modifiedAt ? format(new Date(modifiedAt), 'dd/MM/yyyy') : '',
        previousStatus: setValueFromCatalog('patientStatuses', previousStatus),
      };
    },
  );
};

export const setPatientCensusBadges = (
  data: PatientCensusFiltersChipsCountersPayload,
  filters: PatientCensusFilters,
) => {
  const setIsolationCounter = (name: PatientCensusIsolationFilter) => {
    switch (name) {
      case PatientCensusIsolationFilter.NonInfectious:
        return data.infection.normal;
      case PatientCensusIsolationFilter.Hiv:
        return data.infection.hiv;
      case PatientCensusIsolationFilter.HepB:
        return data.infection.hepB;
      case PatientCensusIsolationFilter.HepC:
        return data.infection.hepC;
      case PatientCensusIsolationFilter.Isolated:
        return data.infection.hiv + data.infection.hepB + data.infection.hepC;
      default:
        return 0;
    }
  };
  const setStatusCounter = (name: PatientCensusStatusFilter) => {
    switch (name) {
      case PatientCensusStatusFilter.Permanent:
        return data.therapy.permanent;
      case PatientCensusStatusFilter.Visiting:
        return data.therapy.visiting;
      case PatientCensusStatusFilter.WalkIn:
        return data.therapy.walkIn;
      case PatientCensusStatusFilter.Dead:
        return data.therapy.dead;
      case PatientCensusStatusFilter.Discharged:
        return data.therapy.discharged;
      case PatientCensusStatusFilter.Hospitalized:
        return data.therapy.hospitalized;
      case PatientCensusStatusFilter.Temporary_Transferred:
        return data.therapy.temporaryTransferred;
      default:
        return 0;
    }
  };
  return {
    ...filters,
    isolations: filters.isolations.map((isolation) => ({
      ...isolation,
      badge: setIsolationCounter(isolation.name).toString(),
    })),
    statuses: filters.statuses.map((status) => ({ ...status, badge: setStatusCounter(status.name).toString() })),
  };
};
