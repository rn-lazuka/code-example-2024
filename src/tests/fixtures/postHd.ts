import { PostHd } from '@types';
import { PostHdBleedingStatus, PostHdSummary, PatientCondition, AccessCondition } from '@enums';

export const postHdFixture = (data?): PostHd => ({
  weight: {
    preSessionWeight: '100',
    postSessionWeight: '99',
    weightLoss: '1',
  },
  indicators: {
    standingSystolicBloodPressure: '11',
    standingDiastolicBloodPressure: '22',
    standingPulse: '33',
    sittingSystolicBloodPressure: '44',
    sittingDiastolicBloodPressure: '55',
    sittingPulse: '66',
    bodyTemperature: '38',
  },
  patientCondition: `form.${PatientCondition.Acceptable}`,
  accessCondition: `form.${AccessCondition.NoProblemsPostHd}`,
  bleedingStatus: `form.${PostHdBleedingStatus.WithoutDifficulties}`,
  summary: {
    type: PostHdSummary.Uneventful,
    text: 'all is ok',
  },
  ...data,
});
