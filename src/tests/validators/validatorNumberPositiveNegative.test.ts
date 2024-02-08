import { validatorNumberPositiveNegative } from '@validators';

describe('validatorNumberPositiveNegative', () => {
  it('should return true if value is a positive or negative integer', () => {
    expect(validatorNumberPositiveNegative(10)).toBe(true);
    expect(validatorNumberPositiveNegative(-5)).toBe(true);
  });

  it('should return an error message if value is not a positive or negative integer', () => {
    const errorMessage = 'common:validation.numbersPositiveNegative';
    expect(validatorNumberPositiveNegative(3.14)).toBe(errorMessage);
    expect(validatorNumberPositiveNegative('abc')).toBe(errorMessage);
    expect(validatorNumberPositiveNegative(undefined)).toBe(errorMessage);
    expect(validatorNumberPositiveNegative({})).toBe(errorMessage);
  });
});
