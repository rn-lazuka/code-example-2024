import { PatientStatuses } from '@enums';
import { noDeadPatientsFilter } from '@utils';

describe('noDischargedPatientsFilter', () => {
  it('should return false if status is Dead', () => {
    expect(noDeadPatientsFilter({ status: PatientStatuses.Dead })).toBeFalsy();
  });
  it('should return false if status is not Dead', () => {
    expect(noDeadPatientsFilter({ status: PatientStatuses.Permanent })).toBeTruthy();
  });
});
