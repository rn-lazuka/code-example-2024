import { validatorAutocompleteMultiplePattern, validatorNumberInt } from '@validators';

describe('validatorAutocompleteMultiplePattern', () => {
  const pattern = validatorNumberInt();
  const validator = validatorAutocompleteMultiplePattern(pattern);
  const validValue = [1];
  const invalidValue = ['incorrect'];

  it('should return true if it has valid value', () => {
    expect(validator(validValue)).toBeTruthy();
  });

  it('should return error message because value is incorrect', () => {
    expect(validator(invalidValue)).toBe(pattern.message);
  });
});
