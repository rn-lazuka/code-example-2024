import { validatorIsValidDate, validatorPastDate } from '../../validators';

describe('validatorIsValidDate', () => {
  const validValue = new Date();
  const incorrectValue = 'incorrectValue';

  it("should return true if it's null", () => {
    expect(validatorPastDate(null)).toEqual(true);
  });

  it('should return true if it has valid value', () => {
    expect(validatorIsValidDate(validValue)).toBeTruthy();
  });

  it('should return true because value is incorrect', () => {
    expect(validatorIsValidDate(incorrectValue)).toEqual('common:validation.invalidDate');
  });
});
