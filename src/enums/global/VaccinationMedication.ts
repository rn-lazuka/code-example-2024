export enum VaccineMedicationServiceType {
  Medication = 'MEDICATION',
  Vaccine = 'VACCINE',
}

export enum VaccinationType {
  ToAdminister = 'INTERNAL_TO_ADMINISTER',
  Administered = 'EXTERNAL_ADMINISTERED',
}

export enum VaccinationDossingSchedule {
  First = 'FIRST',
  Second = 'SECOND',
  Third = 'THIRD',
  Forth = 'FORTH',
  Booster = 'BOOSTER',
  Single = 'SINGLE',
}

export enum VaccinationStatus {
  NotDone = 'NOT_DONE',
  Pending = 'PENDING',
  AdministeredExternal = 'ADMINISTERED_EXTERNAL',
  AdministeredInternal = 'ADMINISTERED_INTERNAL',
  Omitted = 'OMITTED',
}

export enum VaccinationMedicationAdministeringStatus {
  Omit,
  Administering,
}

export enum VaccinationMedicationModalType {
  Editing,
  Adding,
}

export enum VaccineMedicationOmittingStatus {
  Rescheduled = 'RESCHEDULED',
  Omitted = 'OMITTED',
}

export enum VaccinationMedicationResolution {
  Rescheduled = 'RESCHEDULED',
  Administered = 'ADMINISTERED',
  Omitted = 'OMITTED',
}
