export enum HdReadingOfflineOperationType {
  Create = 'CREATE',
  Update = 'UPDATE',
  Delete = 'DELETE',
}

export enum DialysisStatus {
  CheckIn = 'CHECK_IN',
  PreDialysis = 'PRE_DIALYSIS',
  HDReading = 'HD_READING',
  PostDialysis = 'POST_DIALYSIS',
  Completed = 'COMPLETED',
  Cancelled = 'CANCELLED',
}

export enum DialysisSubmitSource {
  HEADER,
  FORM,
}

export enum AppointmentSkipReason {
  PatientRequest = 'PATIENT_REQUEST',
  PatientHospitalized = 'PATIENT_WAS_HOSPITALIZED',
  PatientTemporaryTransferred = 'TRANSFERRED',
  PatientAbsent = 'PATIENT_WAS_ABSENT',
  TechnicalIssue = 'TECHNICAL_ISSUE',
}

export enum AppointmentEventPlace {
  Services,
  Scheduler,
}

export enum DoctorsReviewResolutions {
  Perform = 'PERFORMED',
  Omit = 'OMITTED',
}
