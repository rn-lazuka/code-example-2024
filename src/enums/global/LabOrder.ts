export enum LabOrderStatus {
  TO_PERFORM = 'TO_PERFORM',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  TO_SUBMIT = 'TO_SUBMIT',
  OMITTED = 'OMITTED',
  DRAFT = 'DRAFT',
  RESCHEDULED = 'RESCHEDULED',
}

export enum LabResultInputType {
  User = 'USER',
  Lab = 'LAB',
}

export enum LabOrdersPlace {
  Header = 'HEADER',
  Profile = 'PROFILE',
}

export enum OmitLabTestType {
  RescheduleToNextSession = 'RESCHEDULED',
  OmitPermanently = 'OMITTED',
}
