import { getTenantDate, getTenantYesterdayDate } from '@utils/getTenantDate';
import { validatorNotTodayDate } from '@validators/validatorNotTodayDate';

describe('validatorNotTodayDate', () => {
  const invalidDate = getTenantDate();
  const validDate = getTenantYesterdayDate();
  const errorMessage = 'test error';
  const validator = validatorNotTodayDate(errorMessage);

  it('should return true if it has null value', () => {
    expect(validator(null)).toEqual(true);
  });

  it('should return true if it has valid value', () => {
    expect(validator(validDate)).toEqual(true);
  });

  it('should return true if it has nullable value', () => {
    expect(validator(invalidDate)).toEqual(errorMessage);
  });
});
