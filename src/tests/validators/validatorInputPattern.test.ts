import { validatorInputPattern } from '@validators';

describe('validatorInputPattern', () => {
  it('should return true if value matches string pattern', () => {
    const pattern = { value: '^[A-Za-z]+$', message: 'Value does not match pattern' };
    const validate = validatorInputPattern(pattern);

    expect(validate('abc')).toBe(true);
    expect(validate('xyz')).toBe(true);
  });

  it('should return the error message if value does not match string pattern', () => {
    const pattern = { value: '^[0-9]+$', message: 'Value does not match pattern' };
    const validate = validatorInputPattern(pattern);

    expect(validate('abc123')).toBe('Value does not match pattern');
    expect(validate('xyz789')).toBe('Value does not match pattern');
  });

  it('should return true if value matches regular expression pattern', () => {
    const pattern = { value: /^[0-9]+$/, message: 'Value does not match pattern' };
    const validate = validatorInputPattern(pattern);

    expect(validate('123')).toBe(true);
    expect(validate('987')).toBe(true);
  });

  it('should return the error message if value does not match regular expression pattern', () => {
    const pattern = { value: /^[A-Za-z]+$/, message: 'Value does not match pattern' };
    const validate = validatorInputPattern(pattern);

    expect(validate('abc123')).toBe('Value does not match pattern');
    expect(validate('xyz789')).toBe('Value does not match pattern');
  });

  it('should return true if value is falsy', () => {
    const pattern = { value: /^[A-Za-z]+$/, message: 'Value does not match pattern' };
    const validate = validatorInputPattern(pattern);

    expect(validate(null)).toBe(true);
    expect(validate(undefined)).toBe(true);
    expect(validate('')).toBe(true);
  });
});
