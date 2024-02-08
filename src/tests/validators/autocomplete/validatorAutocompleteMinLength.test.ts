import { validatorAutocompleteMinLength } from '@validators';

describe('validatorAutocompleteMinLength', () => {
  it('should return true if value is not provided', () => {
    const data = {};
    const result = validatorAutocompleteMinLength(5, 10)(data);
    expect(result).toBe(true);
  });

  it('should return true if value length is greater than or equal to min length', () => {
    const data = { value: '1234567890' };
    const result = validatorAutocompleteMinLength(5, 10)(data);
    expect(result).toBe(true);
  });

  it('should return error message if value length is less than min length', () => {
    const data = { value: '1234' };
    const result = validatorAutocompleteMinLength(5, 10)(data);
    expect(result).toBe('common:validation.length');
  });
});
