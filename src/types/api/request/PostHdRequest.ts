export interface PostHdRequest {
  weight: {
    postSessionWeight: string;
  };
  indicators: {
    standingSystolicBloodPressure: string;
    standingDiastolicBloodPressure: string;
    standingPulse: string;
    sittingSystolicBloodPressure: string;
    sittingDiastolicBloodPressure: string;
    sittingPulse: string;
    bodyTemperature: string;
  };
  patientCondition: string;
  accessCondition: string;
  bleedingStatus: string;
  summary: {
    type: string;
    text: string;
  };
}
