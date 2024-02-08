import { validatorFutureDate } from '../../validators';
import { subDays, addDays } from 'date-fns';
import { getTenantDate } from '@utils/getTenantDate';

describe('validatorFutureDate', () => {
  const validator = validatorFutureDate();
  const validValue = subDays(getTenantDate(), 1);
  const invalidValue = addDays(getTenantDate(), 1);

  it("should return true if it's null", () => {
    expect(validator(null)).toEqual(true);
  });

  it('should return true if it has valid value', () => {
    expect(validator(validValue)).toEqual(true);
  });

  it('should return error message if it has invalid value', () => {
    expect(validator(invalidValue)).toEqual('common:validation.cannotBeFuture');
  });
});
