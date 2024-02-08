import { validatorAutocompletePattern } from '@validators';

describe('validatorAutocompletePattern', () => {
  it('returns true if value is undefined', () => {
    const data = {};
    const pattern = { value: /^[a-z]+$/, message: 'Only lowercase letters allowed' };
    expect(validatorAutocompletePattern(pattern)(data)).toBe(true);
  });

  it('returns true if value matches the pattern', () => {
    const data = { label: 'abc' };
    const pattern = { value: /^[a-z]+$/, message: 'Only lowercase letters allowed' };
    expect(validatorAutocompletePattern(pattern)(data)).toBe(true);
  });

  it('returns pattern.message if value does not match the pattern', () => {
    const data = { label: 'Abc' };
    const pattern = { value: /^[a-z]+$/, message: 'Only lowercase letters allowed' };
    expect(validatorAutocompletePattern(pattern)(data)).toBe('Only lowercase letters allowed');
  });
});
