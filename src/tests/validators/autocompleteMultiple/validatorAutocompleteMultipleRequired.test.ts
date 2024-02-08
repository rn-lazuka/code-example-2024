import { validatorAutocompleteMultipleRequired } from '@validators';

describe('validatorAutocompleteMultiplePattern', () => {
  const validator = validatorAutocompleteMultipleRequired();
  const validValue = ['correct'];
  const invalidValue = [];

  it('should return true if it has valid value', () => {
    expect(validator(validValue)).toBeTruthy();
  });

  it('should return error message because value is incorrect', () => {
    expect(validator(invalidValue)).toBe('common:validation.required');
  });
});
