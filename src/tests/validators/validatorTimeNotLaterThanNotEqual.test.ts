import { getTenantYesterdayDate } from '@utils';
import { addDays, subDays } from 'date-fns';
import { validatorTimeNotLaterThanNotEqual } from '@validators';

describe('validatorTimeNotLaterThanNotEqual', () => {
  const pastDate = getTenantYesterdayDate();
  const invalidDate = addDays(pastDate, 1);
  const validDate = subDays(pastDate, 1);
  const validator = validatorTimeNotLaterThanNotEqual(pastDate);

  it('should return true if it has valid value', () => {
    expect(validator(validDate)).toEqual(true);
  });

  it('should return true if it has nullable value', () => {
    expect(validator(null)).toEqual(true);
  });

  it('should return error message because value is incorrect', () => {
    expect(validator(invalidDate)).toEqual('common:validation.enteredDateShouldNotBeLaterThan');
  });
});
