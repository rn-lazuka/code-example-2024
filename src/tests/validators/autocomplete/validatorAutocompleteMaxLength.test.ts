import { validatorAutocompleteMaxLength } from '@validators';
import i18n from 'i18next';

describe('validatorAutocompleteMaxLength', () => {
  it('should return error message if value is greater than max length', () => {
    const data = { value: 'abcdefghijklmnopqrstuvwxyz' };
    const minLength = 1;
    const maxLength = 10;
    const field = 'value';
    const result = validatorAutocompleteMaxLength(minLength, maxLength, field)(data);
    expect(result).toBe('common:validation.length');
  });

  it('should return true if value is equal to max length', () => {
    const data = { value: 'abcdefghij' };
    const minLength = 1;
    const maxLength = 10;
    const field = 'value';
    const result = validatorAutocompleteMaxLength(minLength, maxLength, field)(data);
    expect(result).toBe(true);
  });

  it('should return true if value is less than max length', () => {
    const data = { value: 'abcde' };
    const minLength = 1;
    const maxLength = 10;
    const field = 'value';
    const result = validatorAutocompleteMaxLength(minLength, maxLength, field)(data);
    expect(result).toBe(true);
  });

  it('should return true if value is not defined', () => {
    const data = {};
    const minLength = 1;
    const maxLength = 10;
    const field = 'value';
    const result = validatorAutocompleteMaxLength(minLength, maxLength, field)(data);
    expect(result).toBe(true);
  });
});
