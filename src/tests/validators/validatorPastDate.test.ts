import { validatorPastDate } from '../../validators';

describe('validatorPastDate', () => {
  const validValue = new Date(new Date().getTime() + 100000000);
  const invalidValue = new Date(new Date().getTime() - 100000000);

  it("should return true if it's null", () => {
    expect(validatorPastDate(null)).toEqual(true);
  });

  it('should return true if it has valid value', () => {
    expect(validatorPastDate(validValue)).toEqual(true);
  });

  it('should return true if it has invalid value', () => {
    expect(validatorPastDate(invalidValue)).toEqual('common:validation.cannotBePast');
  });
});
