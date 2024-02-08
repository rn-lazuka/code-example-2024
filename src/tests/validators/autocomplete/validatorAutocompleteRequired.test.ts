import { validatorAutocompleteRequired } from '@validators';

describe('validatorAutocompleteRequired', () => {
  it('should return "This field is required" if data is undefined', () => {
    expect(validatorAutocompleteRequired()(undefined)).toEqual('common:validation.required');
  });

  it('should return "This field is required" if data has no label, value, id, or uid', () => {
    expect(validatorAutocompleteRequired()(null)).toEqual('common:validation.required');
  });

  it('should return true if data has a label', () => {
    expect(validatorAutocompleteRequired()({ label: 'label' })).toEqual(true);
  });

  it('should return true if data has a value', () => {
    expect(validatorAutocompleteRequired()({ value: 'value' })).toEqual(true);
  });

  it('should return true if data has an id', () => {
    expect(validatorAutocompleteRequired()({ id: 1 })).toEqual(true);
  });

  it('should return true if data has a uid', () => {
    expect(validatorAutocompleteRequired()({ uid: 'uid' })).toEqual(true);
  });
});
