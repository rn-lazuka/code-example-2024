import { validatorMaxLengthPattern } from '@validators';

describe('validatorMaxLengthPattern', () => {
  it('should return true if value length is less than or equal to pattern value', () => {
    const pattern = { value: 10, message: 'Value is too long' };
    const validate = validatorMaxLengthPattern(pattern);

    expect(validate('hello')).toBe(true);
    expect(validate('world')).toBe(true);
    expect(validate('12345')).toBe(true);
  });

  it('should return the error message if value length is greater than pattern value', () => {
    const pattern = { value: 3, message: 'Value is too long' };
    const validate = validatorMaxLengthPattern(pattern);

    expect(validate('hi there')).toBe('Value is too long');
    expect(validate('test123')).toBe('Value is too long');
  });

  it('should return true if value is falsy', () => {
    const pattern = { value: 5, message: 'Value is too long' };
    const validate = validatorMaxLengthPattern(pattern);

    expect(validate(null)).toBe(true);
    expect(validate(undefined)).toBe(true);
    expect(validate('')).toBe(true);
  });
});
