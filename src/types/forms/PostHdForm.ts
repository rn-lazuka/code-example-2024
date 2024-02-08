import { PostHdSummary } from '@enums';

export interface PostHDForm {
  postSessionWeight: { label: string; value: string };
  weightLoss: string;
  standingSystolicBloodPressure: string;
  standingDiastolicBloodPressure: string;
  standingPulse: string;
  sittingSystolicBloodPressure: string;
  sittingDiastolicBloodPressure: string;
  sittingPulse: string;
  bodyTemperature: string;
  patientCondition: string;
  patientConditionExtValue: string;
  accessCondition: string;
  accessConditionExtValue: string;
  bleedingStatus: string;
  bleedingStatusExtValue: string;
  summaryType: PostHdSummary;
  summaryText: string;
}
