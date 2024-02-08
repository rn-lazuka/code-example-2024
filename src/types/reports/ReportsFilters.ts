import {
  CvcTimeCategory,
  VascularAccessType,
  ChipsCountersSumNames,
  VascularAccessFilterNames,
  PatientCensusIsolationFilter,
  PatientCensusStatusFilter,
  PatientHospitalizationReason,
} from '@enums';
import { SelectOptionProps } from '@components/Select/Select';

type AccessTypeFilterItem = {
  name: VascularAccessType | ChipsCountersSumNames.vascular;
  selected: boolean;
  badge: string | null;
};

type CategoriesFilterItem = Omit<AccessTypeFilterItem, 'name'> & {
  name: CvcTimeCategory | ChipsCountersSumNames.cvc;
};

export type VascularAccessChipsCountersPayload = {
  [VascularAccessFilterNames.accessTypes]: AccessTypeFilterItem[];
  [VascularAccessFilterNames.categories]: CategoriesFilterItem[];
};

export type VascularAccessFilters = {
  date: Date | null;
  accessTypes: AccessTypeFilterItem[];
  categories: CategoriesFilterItem[];
};

export type VascularAccessFiltersErrors = {
  date: null | string;
};

export type HospitalizationReportReasonsFilterItem = {
  name: PatientHospitalizationReason;
  selected: boolean;
  badge: string | null;
};

export type HospitalizationReportFilters = {
  date: Date | null;
  patient: { label: string; id: number } | null;
  reasons: HospitalizationReportReasonsFilterItem[];
};

export type HospitalizationReportFiltersErrors = {
  date: string | null;
  patient: string | null;
};

export type InjectionReportFilters = {
  fromDate: Date | null;
  toDate: Date | null;
  patient: { label: string; id: number } | null;
  injection: string | null;
  shifts: SelectOptionProps[];
};

export type InjectionReportFiltersError = {
  fromDate: string | null;
  toDate: string | null;
  patient: string | null;
};

export type PatientStationHistoryFilters = {
  fromDate: Date | null;
  toDate: Date | null;
  patient: { label: string; id: number } | null;
  locations: SelectOptionProps;
  dialysisMachineNumber: { label: string; value: number } | null;
  startTime: Date | null;
  endTime: Date | null;
};

export type PatientStationHistoryFiltersError = {
  fromDate: string | null;
  toDate: string | null;
  patient: string | null;
  startTime: string | null;
  endTime: string | null;
};

export type MortalityReportFilters = {
  fromDate: Date | null;
  toDate: Date | null;
  patient: { label: string; id: number } | null;
};

export type MortalityReportFiltersError = {
  fromDate: string | null;
  toDate: string | null;
  patient: string | null;
};

export type PatientCensusFilters = {
  date: Date | null;
  isolations: { name: PatientCensusIsolationFilter; selected: boolean; badge: string | null }[];
  statuses: { name: PatientCensusStatusFilter; selected: boolean; badge: string | null }[];
};

export type PatientCensusFiltersChipsCountersPayload = {
  infection: {
    normal: number;
    hiv: number;
    hepB: number;
    hepC: number;
  };
  therapy: {
    permanent: number;
    visiting: number;
    acute: number;
    walkIn: number;
    dead: number;
    discharged: number;
    hospitalized: number;
    temporaryTransferred: number;
  };
};

export type PatientCensusFiltersError = {
  date: null | string;
};
