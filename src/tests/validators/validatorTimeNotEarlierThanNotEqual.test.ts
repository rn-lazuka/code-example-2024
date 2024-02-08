import { getTenantYesterdayDate } from '@utils/getTenantDate';
import { subDays } from 'date-fns';
import { validatorTimeNotEarlierThan } from '@validators';

describe('validatorTimeNotEarlierThan', () => {
  const pastDate = getTenantYesterdayDate();
  const invalidDate = subDays(pastDate, 1);
  const validDate = new Date();
  const validator = validatorTimeNotEarlierThan(pastDate);

  it('should return true if it has valid value', () => {
    expect(validator(validDate)).toEqual(true);
  });

  it('should return true if it has nullable value', () => {
    expect(validator(null)).toEqual(true);
  });

  it('should return true if it has invalid pastDate', () => {
    expect(validatorTimeNotEarlierThan(new Date(-100500))(validDate)).toEqual(true);
  });

  it('should return error message because value is incorrect', () => {
    expect(validator(invalidDate)).toEqual('common:validation.endTimeCanNotBeEarlier');
  });
});
