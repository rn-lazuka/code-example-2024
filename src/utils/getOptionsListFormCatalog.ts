import {
  ACCESS_CATEGORIES_EN,
  ACCESS_TYPES_EN,
  ANTICOAGULANT_TYPE_EN,
  BLOOD_TYPES_EN,
  COUNTRIES_EN,
  CVC_CATEGORIES_EN,
  DAYS_OF_WEEK_EN,
  DIALYSIS_DAY_EN,
  DIALYZER_EN,
  DOCUMENT_TYPE_EN,
  EDUCATION_EN,
  FREQUENCY_EN,
  GENDERS_EN,
  INSTILLATION_EN,
  ISOLATION_BAY_NUMBER_EN,
  LAB_ORDERS_SPECIMEN_TYPES_EN,
  LANGUAGES_EN,
  MARITAL_STATUS_EN,
  MEAL_EN,
  MEDICATION_FREQUENCY_AT_HOME_EN,
  MEDICATION_GROUP_EN,
  NATIONALITIES_EN,
  NEEDLE_SIZES_EN,
  NEEDLE_TYPES_EN,
  OCCUPATIONS_EN,
  PATIENT_STATUSES_EN,
  RACES_EN,
  RELIGIONS_EN,
  ROUTE_EN,
  SIDES_EN,
  STERLIANT_TYPE_EN,
  VIROLOGY_STATUSES_EN,
  ORDER_STATUS_EN,
  LAB_ORDERS_MEAL_STATUS_EN,
  LAB_RESULTS_TEST_SET_NAME_EN,
  LAB_RESULTS_MEASUREMENTS_EN,
  LAB_RESULTS_TEST_VALUES_EN,
  CLINICAL_NOTE_TYPE_EN,
  VACCINES_EN,
  DOSING_SCHEDULE_EN,
  DOCTOR_SPECIALITIES_EN,
  ISOLATIONS_EN,
  DIALYSIS_MACHINE_COMMUNICATION_TYPE_EN,
  DIALYSIS_MACHINE_STATUSES_EN,
  DIALYSIS_MACHINE_INFECTION_STATUSES_EN,
  PATIENT_HOSPITALIZATION_REASONS_EN,
  SKIPPING_REASONS_EN,
  HOSPITALIZATION_DETAILS_EN,
  USER_ROLES_EN,
  STAFF_SPECIALITIES_EN,
  USER_RESPONSIBILITIES_EN,
  MEDICATION_FREQUENCY_ALL_EN,
  ADD_HOC_EVENT_TYPE_EN,
  LAB_ORDERS_TYPE_EN,
  LAB_ORDER_TYPE_FILTER_EN,
} from '../i18n/en';
import i18n from 'i18next';

export enum Dictionaries {
  Countries = 'COUNTRIES',
  Educations = 'EDUCATIONS',
  Religions = 'RELIGIONS',
  Languages = 'LANGUAGES',
  Nationalities = 'NATIONALITIES',
  Races = 'RACES',
  Occupations = 'OCCUPATIONS',
  Genders = 'GENDERS',
  DocumentTypes = 'DOCUMENT_TYPES',
  MaritalStatuses = 'MARITAL_STATUSES',
  BloodTypes = 'BLOOD_TYPES',
  VirologyStatuses = 'VIROLOGY_STATUSES',
  PatientStatuses = 'STATUSES',
  AccessCategories = 'ACCESS_CATEGORIES',
  AccessTypes = 'ACCESS_TYPES',
  CvcCategories = 'CVC_CATEGORIES',
  Instillation = 'INSTILLATION',
  NeedleSizes = 'NEEDLE_SIZES',
  NeedleTypes = 'NEEDLE_TYPES',
  Sides = 'SIDES',
  Frequency = 'FREQUENCY',
  DaysOfWeek = 'DAYS_OF_WEEK',
  Dialyzer = 'DIALYZER',
  MedicationGroup = 'MEDICATION_GROUP',
  Route = 'ROUTE',
  MedicationFrequencyAtHome = 'MEDICATION_FREQUENCY_AT_HOME',
  MedicationFrequencyInCenter = 'MEDICATION_FREQUENCY_IN_CENTER',
  MedicationFrequencyAll = 'MEDICATION_FREQUENCY_ALL',
  DialysisDay = 'DIALYSIS_DAY',
  Meal = 'MEAL',
  AnticoagulantType = 'ANTICOAGULANT_TYPE',
  SterilantType = 'STERLIANT_TYPE',
  IsolationBayNumber = 'ISOLATION_BAY_NUMBER',
  LabOrdersSpecimenTypes = 'LAB_ORDERS_SPECIMEN_TYPES',
  LabOrderTypes = 'LAB_ORDER_TYPES',
  LabOrdersMealStatus = 'LAB_ORDERS_MEAL_STATUS',
  LabResultsTestValues = 'LAB_RESULTS_TEST_VALUES',
  LabResultsMeasurements = 'LAB_RESULTS_MEASUREMENTS',
  LabResultsTestSetName = 'LAB_RESULTS_TEST_SET_NAME',
  ProcedureType = 'PROCEDURE_TYPE',
  OrderStatus = 'OrderStatus',
  ClinicalNoteType = 'CLINICAL_NOTE_TYPE',
  Vaccines = 'VACCINES',
  DosingSchedule = 'DOSING_SCHEDULE',
  DoctorSpecialities = 'DOCTOR_SPECIALITIES',
  Isolations = 'ISOLATIONS',
  DialysisMachineCommunicationTypes = 'DIALYSIS_MACHINE_COMMUNICATION_TYPE',
  DialysisMachineStatuses = 'DIALYSIS_MACHINE_STATUSES',
  DialysisMachineInfectionStatuses = 'DIALYSIS_MACHINE_INFECTION_STATUSES',
  PatientHospitalizationReasons = 'PATIENT_HOSPITALIZATION_REASONS',
  SkippingReasons = 'APPOINTMENT_SKIPPING_REASONS',
  HospitalizationDetails = 'HOSPITALIZATION_DETAILS',
  StaffSpecialities = 'STAFF_SPECIALITIES',
  UserRoles = 'USER_ROLES',
  UserResponsibilities = 'USER_RESPONSIBILITIES',
  AddHocEventTypes = 'ADD_HOC_EVENT_TYPE',
  LabOrderTypeFilter = 'LAB_ORDER_TYPE_FILTER',
}

export const DictionariesTranslationsMap = {
  country: Dictionaries.Countries,
  educationLevel: Dictionaries.Educations,
  religion: Dictionaries.Religions,
  language: Dictionaries.Languages,
  nationality: Dictionaries.Nationalities,
  race: Dictionaries.Races,
  occupation: Dictionaries.Occupations,
  gender: Dictionaries.Genders,
  document: Dictionaries.DocumentTypes,
  maritalStatus: Dictionaries.MaritalStatuses,
  bloodType: Dictionaries.BloodTypes,
  virologyStatuses: Dictionaries.VirologyStatuses,
  patientStatuses: Dictionaries.PatientStatuses,
  accessCategories: Dictionaries.AccessCategories,
  accessTypes: Dictionaries.AccessTypes,
  cvcCategories: Dictionaries.CvcCategories,
  instillation: Dictionaries.Instillation,
  needleSizes: Dictionaries.NeedleSizes,
  needleTypes: Dictionaries.NeedleTypes,
  sides: Dictionaries.Sides,
  frequency: Dictionaries.Frequency,
  daysOfWeek: Dictionaries.DaysOfWeek,
  dialyzer: Dictionaries.Dialyzer,
  medicationGroup: Dictionaries.MedicationGroup,
  route: Dictionaries.Route,
  medicationFrequencyAtHome: Dictionaries.MedicationFrequencyAtHome,
  medicationFrequencyInCenter: Dictionaries.MedicationFrequencyInCenter,
  medicationFrequencyAll: Dictionaries.MedicationFrequencyAll,
  dialysisDay: Dictionaries.DialysisDay,
  meal: Dictionaries.Meal,
  anticoagulantType: Dictionaries.AnticoagulantType,
  sterilantType: Dictionaries.SterilantType,
  isolationBayNumber: Dictionaries.IsolationBayNumber,
  LabOrdersSpecimenTypes: Dictionaries.LabOrdersSpecimenTypes,
  LabOrderTypes: Dictionaries.LabOrderTypes,
  LabOrdersMealStatus: Dictionaries.LabOrdersMealStatus,
  LabResultsTestValues: Dictionaries.LabResultsTestValues,
  LabResultsMeasurements: Dictionaries.LabResultsMeasurements,
  LabResultsTestSetName: Dictionaries.LabResultsTestSetName,
  procedureType: Dictionaries.ProcedureType,
  orderStatus: Dictionaries.OrderStatus,
  clinicalNoteType: Dictionaries.ClinicalNoteType,
  vaccines: Dictionaries.Vaccines,
  dosingSchedule: Dictionaries.DosingSchedule,
  doctorSpecialities: Dictionaries.DoctorSpecialities,
  Isolations: Dictionaries.Isolations,
  dialysisMachineCommunicationTypes: Dictionaries.DialysisMachineCommunicationTypes,
  dialysisMachineStatuses: Dictionaries.DialysisMachineStatuses,
  dialysisMachineInfectionStatuses: Dictionaries.DialysisMachineInfectionStatuses,
  patientHospitalizationReasons: Dictionaries.PatientHospitalizationReasons,
  skippingReasons: Dictionaries.SkippingReasons,
  hospitalizationDetails: Dictionaries.HospitalizationDetails,
  staffSpecialities: Dictionaries.StaffSpecialities,
  userRoles: Dictionaries.UserRoles,
  userResponsibilities: Dictionaries.UserResponsibilities,
  addHocEventTypes: Dictionaries.AddHocEventTypes,
  labOrderTypeFilter: Dictionaries.LabOrderTypeFilter,
};

export const getOptionListFromCatalog = (name: Dictionaries, disabledOptions?: number[]) => {
  let keysList: string[] = [];
  switch (true) {
    case name === Dictionaries.Countries:
      keysList = Object.keys(COUNTRIES_EN);
      break;
    case name === Dictionaries.Educations:
      keysList = Object.keys(EDUCATION_EN);
      break;
    case name === Dictionaries.Religions:
      keysList = Object.keys(RELIGIONS_EN);
      break;
    case name === Dictionaries.Languages:
      keysList = Object.keys(LANGUAGES_EN);
      break;
    case name === Dictionaries.Nationalities:
      keysList = Object.keys(NATIONALITIES_EN);
      break;
    case name === Dictionaries.Races:
      keysList = Object.keys(RACES_EN);
      break;
    case name === Dictionaries.Occupations:
      keysList = Object.keys(OCCUPATIONS_EN);
      break;
    case name === Dictionaries.Genders:
      keysList = Object.keys(GENDERS_EN);
      break;
    case name === Dictionaries.DocumentTypes:
      keysList = Object.keys(DOCUMENT_TYPE_EN);
      break;
    case name === Dictionaries.MaritalStatuses:
      keysList = Object.keys(MARITAL_STATUS_EN);
      break;
    case name === Dictionaries.BloodTypes:
      keysList = Object.keys(BLOOD_TYPES_EN);
      break;
    case name === Dictionaries.VirologyStatuses:
      keysList = Object.keys(VIROLOGY_STATUSES_EN);
      break;
    case name === Dictionaries.PatientStatuses:
      keysList = Object.keys(PATIENT_STATUSES_EN);
      break;
    case name === Dictionaries.AccessCategories:
      keysList = Object.keys(ACCESS_CATEGORIES_EN);
      break;
    case name === Dictionaries.AccessTypes:
      keysList = Object.keys(ACCESS_TYPES_EN);
      break;
    case name === Dictionaries.CvcCategories:
      keysList = Object.keys(CVC_CATEGORIES_EN);
      break;
    case name === Dictionaries.Instillation:
      keysList = Object.keys(INSTILLATION_EN);
      break;
    case name === Dictionaries.NeedleSizes:
      keysList = Object.keys(NEEDLE_SIZES_EN);
      break;
    case name === Dictionaries.NeedleTypes:
      keysList = Object.keys(NEEDLE_TYPES_EN);
      break;
    case name === Dictionaries.Sides:
      keysList = Object.keys(SIDES_EN);
      break;
    case name === Dictionaries.Frequency:
      keysList = Object.keys(FREQUENCY_EN);
      break;
    case name === Dictionaries.DaysOfWeek:
      keysList = Object.keys(DAYS_OF_WEEK_EN);
      break;
    case name === Dictionaries.Dialyzer:
      keysList = Object.keys(DIALYZER_EN);
      break;
    case name === Dictionaries.MedicationGroup:
      keysList = Object.keys(MEDICATION_GROUP_EN);
      break;
    case name === Dictionaries.Route:
      keysList = Object.keys(ROUTE_EN);
      break;
    case name === Dictionaries.MedicationFrequencyAtHome:
      keysList = Object.keys(MEDICATION_FREQUENCY_AT_HOME_EN);
      break;
    case name === Dictionaries.MedicationFrequencyAll:
      keysList = Object.keys(MEDICATION_FREQUENCY_ALL_EN);
      break;
    case name === Dictionaries.DialysisDay:
      keysList = Object.keys(DIALYSIS_DAY_EN);
      break;
    case name === Dictionaries.Meal:
      keysList = Object.keys(MEAL_EN);
      break;
    case name === Dictionaries.AnticoagulantType:
      keysList = Object.keys(ANTICOAGULANT_TYPE_EN);
      break;
    case name === Dictionaries.SterilantType:
      keysList = Object.keys(STERLIANT_TYPE_EN);
      break;
    case name === Dictionaries.IsolationBayNumber:
      keysList = Object.keys(ISOLATION_BAY_NUMBER_EN);
      break;
    case name === Dictionaries.LabOrdersSpecimenTypes:
      keysList = Object.keys(LAB_ORDERS_SPECIMEN_TYPES_EN);
      break;
    case name === Dictionaries.LabOrderTypes:
      keysList = Object.keys(LAB_ORDERS_TYPE_EN);
      break;
    case name === Dictionaries.LabOrdersMealStatus:
      keysList = Object.keys(LAB_ORDERS_MEAL_STATUS_EN);
      break;
    case name === Dictionaries.LabResultsTestSetName:
      keysList = Object.keys(LAB_RESULTS_TEST_SET_NAME_EN);
      break;
    case name === Dictionaries.LabResultsMeasurements:
      keysList = Object.keys(LAB_RESULTS_MEASUREMENTS_EN);
      break;
    case name === Dictionaries.LabResultsTestValues:
      keysList = Object.keys(LAB_RESULTS_TEST_VALUES_EN);
      break;
    case name === Dictionaries.OrderStatus:
      keysList = Object.keys(ORDER_STATUS_EN);
      break;
    case name === Dictionaries.ClinicalNoteType:
      keysList = Object.keys(CLINICAL_NOTE_TYPE_EN);
      break;
    case name === Dictionaries.Vaccines:
      keysList = Object.keys(VACCINES_EN);
      break;
    case name === Dictionaries.DosingSchedule:
      keysList = Object.keys(DOSING_SCHEDULE_EN);
      break;
    case name === Dictionaries.DoctorSpecialities:
      keysList = Object.keys(DOCTOR_SPECIALITIES_EN);
      break;
    case name === Dictionaries.Isolations:
      keysList = Object.keys(ISOLATIONS_EN);
      break;
    case name === Dictionaries.DialysisMachineCommunicationTypes:
      keysList = Object.keys(DIALYSIS_MACHINE_COMMUNICATION_TYPE_EN);
      break;
    case name === Dictionaries.DialysisMachineStatuses:
      keysList = Object.keys(DIALYSIS_MACHINE_STATUSES_EN);
      break;
    case name === Dictionaries.DialysisMachineInfectionStatuses:
      keysList = Object.keys(DIALYSIS_MACHINE_INFECTION_STATUSES_EN);
      break;
    case name === Dictionaries.PatientHospitalizationReasons:
      keysList = Object.keys(PATIENT_HOSPITALIZATION_REASONS_EN);
      break;
    case name === Dictionaries.SkippingReasons:
      keysList = Object.keys(SKIPPING_REASONS_EN);
      break;
    case name === Dictionaries.HospitalizationDetails:
      keysList = Object.keys(HOSPITALIZATION_DETAILS_EN);
      break;
    case name === Dictionaries.StaffSpecialities:
      keysList = Object.keys(STAFF_SPECIALITIES_EN);
      break;
    case name === Dictionaries.UserRoles:
      keysList = Object.keys(USER_ROLES_EN);
      break;
    case name === Dictionaries.UserResponsibilities:
      keysList = Object.keys(USER_RESPONSIBILITIES_EN);
      break;
    case name === Dictionaries.AddHocEventTypes:
      keysList = Object.keys(ADD_HOC_EVENT_TYPE_EN);
      break;
    case name === Dictionaries.LabOrderTypeFilter:
      keysList = Object.keys(LAB_ORDER_TYPE_FILTER_EN);
      break;
  }

  return keysList.map((code, index) =>
    disabledOptions
      ? {
          label: i18n.t(`${name}:${code}`),
          value: code,
          disabled: disabledOptions && disabledOptions.includes(index),
        }
      : {
          label: i18n.t(`${name}:${code}`),
          value: code,
        },
  );
};

export const getCodeValueFromCatalog = (key: keyof typeof DictionariesTranslationsMap, value: string) => {
  return i18n.t(`${DictionariesTranslationsMap[key]}:${value}`);
};
