import { validatorDateIsInRange } from '@validators/validatorDateIsInRange';

describe('validatorDateIsInRange', () => {
  const validValue = new Date();
  const invalidValue = new Date(new Date().getTime() + 10000000);
  const dateFrom = new Date(new Date().getTime() - 10000);
  const dateTo = new Date(new Date().getTime() + 10000);

  it('should return true if it has valid value', () => {
    expect(validatorDateIsInRange({ dateFrom, dateTo, convertToTenantDate: false })(validValue)).toEqual(true);
  });

  it('should return true because value is incorrect', () => {
    expect(validatorDateIsInRange({ dateFrom, dateTo })(invalidValue)).toEqual('common:validation.shouldBeInRange');
  });
});
