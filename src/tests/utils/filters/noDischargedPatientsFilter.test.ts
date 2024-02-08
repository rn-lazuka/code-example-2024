import { PatientStatuses } from '@enums';
import { noDischargedPatientsFilter } from '@utils';

describe('noDischargedPatientsFilter', () => {
  it('should return false if status is Discharged', () => {
    expect(noDischargedPatientsFilter({ status: PatientStatuses.Discharged })).toBeFalsy();
  });
  it('should return false if status is not Discharged', () => {
    expect(noDischargedPatientsFilter({ status: PatientStatuses.Permanent })).toBeTruthy();
  });
});
