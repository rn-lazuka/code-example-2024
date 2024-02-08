import { validatorMaxDate } from '@validators';

describe('validatorMaxDate', () => {
  it('returns true if the value is null', () => {
    const result = validatorMaxDate(new Date(), 'fieldName', 'errorMessage')(null);
    expect(result).toBe(true);
  });

  it('returns the error message if the max date is not valid', () => {
    const result = validatorMaxDate(new Date('invalid date'), 'fieldName', 'errorMessage')(new Date());
    expect(result).toEqual('common:validation.checkFieldValue');
  });

  it('returns true if the value is equal to the max date', () => {
    const maxDate = new Date();
    const result = validatorMaxDate(maxDate, 'fieldName', 'errorMessage')(maxDate);
    expect(result).toBe('errorMessage');
  });

  it('returns true if the value is before the max date', () => {
    const maxDate = new Date();
    const result = validatorMaxDate(maxDate, 'fieldName', 'errorMessage')(new Date(maxDate.getTime() - 1));
    expect(result).toBe(true);
  });

  it('returns the error message if the value is after the max date', () => {
    const maxDate = new Date();
    const result = validatorMaxDate(maxDate, 'fieldName', 'errorMessage')(new Date(maxDate.getTime() + 1));
    expect(result).toEqual('errorMessage');
  });

  it('returns the error message if the value is not valid', () => {
    const result = validatorMaxDate(new Date(), 'fieldName', 'errorMessage')('invalid date');
    expect(result).toEqual('errorMessage');
  });
});
