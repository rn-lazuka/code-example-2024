import { validatorNotEarlierThan } from '@validators/validatorNotEarlierThan';

describe('validatorNotEarlierThan', () => {
  const validValue = new Date(new Date().getTime() - 100);
  const invalidValue = new Date(new Date().getTime() - 1000000000);
  const datePast = new Date(new Date().getTime() - 10000);
  const validator = validatorNotEarlierThan(datePast);

  it('should return true if it has valid value', () => {
    expect(validator(validValue)).toEqual(true);
  });

  it('should return true if it has null as value', () => {
    expect(validator(null)).toEqual(true);
  });

  it('should return true if it has null as value', () => {
    expect(validatorNotEarlierThan(new Date(-100500))(null)).toEqual(true);
  });

  it('should return true because value is incorrect', () => {
    expect(validator(invalidValue)).toEqual('common:validation.notEarlierThan');
  });
});
