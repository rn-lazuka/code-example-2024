import { validatorAutocompleteMultipleMaxItemLength } from '@validators';

describe('validatorAutocompleteMultipleMaxItemLength', () => {
  const validator = validatorAutocompleteMultipleMaxItemLength(1, 10);
  const validValue = ['test'];
  const invalidValue = ['test long string'];

  it('should return true if it has valid value', () => {
    expect(validator(validValue)).toBeTruthy();
  });

  it('should return error message because value is incorrect', () => {
    expect(validator(invalidValue)).toBe('common:validation.length');
  });
});
