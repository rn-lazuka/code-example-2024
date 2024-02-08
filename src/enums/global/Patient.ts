export enum PatientStatuses {
  Permanent = 'PERMANENT',
  Walk_In = 'WALK_IN',
  Visiting = 'VISITING',
  Discharged = 'DISCHARGED',
  Temporary_Transferred = 'TEMPORARY_TRANSFERRED',
  Hospitalized = 'HOSPITALIZED',
  Dead = 'DEAD',
}

export enum PatientHospitalizationReason {
  UNKNOWN = 'UNKNOWN',
  HD_RELATED = 'HD_RELATED',
  NON_HD_RELATED = 'NON_HD_RELATED',
  VASCULAR_RELATED = 'VASCULAR_RELATED',
}

export enum PatientStatusFileType {
  Vaccination = 'VACCINATION',
}

export enum FileTypes {
  IdentityDocument = 'IDENTITY_DOCUMENT',
  VirologyStatus = 'VIROLOGY_STATUS',
  MedicalReport = 'MEDICAL_REPORT',
  DeathProof = 'DEATH_PROOF',
  DischargeNotes = 'DISCHARGE_NOTES',
  Consultation = 'CONSULTATION',
  BloodTest = 'BLOOD_TEST',
  HdPrescription = 'HD_PRESCRIPTION',
  Vaccination = 'VACCINATION',
  Status = 'STATUS',
  LabOrderResult = 'LAB_ORDER_RESULTS',
  Staff = 'STAFF',
  Other = 'OTHER',
}

export enum PatientDocumentType {
  Passport = 'PASSPORT',
  NRIC = 'NRIC',
}
