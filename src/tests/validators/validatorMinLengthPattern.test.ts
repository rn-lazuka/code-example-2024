import { validatorMinLengthPattern } from '@validators';

describe('validatorMinLengthPattern', () => {
  it('should return true if value length is greater than or equal to pattern value', () => {
    const pattern = { value: 3, message: 'Value is too short' };
    const validate = validatorMinLengthPattern(pattern);

    expect(validate('hello')).toBe(true);
    expect(validate('world')).toBe(true);
    expect(validate('12345')).toBe(true);
  });

  it('should return the error message if value length is less than pattern value', () => {
    const pattern = { value: 8, message: 'Value is too short' };
    const validate = validatorMinLengthPattern(pattern);

    expect(validate('hi')).toBe('Value is too short');
    expect(validate('test')).toBe('Value is too short');
  });

  it('should return true if value is falsy', () => {
    const pattern = { value: 5, message: 'Value is too short' };
    const validate = validatorMinLengthPattern(pattern);

    expect(validate(null)).toBe(true);
    expect(validate(undefined)).toBe(true);
    expect(validate('')).toBe(true);
  });
});
