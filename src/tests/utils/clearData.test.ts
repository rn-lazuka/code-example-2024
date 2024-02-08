import { clearData } from '@utils';

describe('clearData', () => {
  it('should remove empty string', () => {
    const data = { emptyValue: '', nonEmptyValue: 'value' };
    const expectedValue = { nonEmptyValue: 'value' };
    expect(clearData(data)).toStrictEqual(expectedValue);
  });

  it('should remove null', () => {
    const data = { emptyValue: null, nonEmptyValue: 'value' };
    const expectedValue = { nonEmptyValue: 'value' };
    expect(clearData(data)).toStrictEqual(expectedValue);
  });

  it('should remove undefined', () => {
    const data = { emptyValue: undefined, nonEmptyValue: 'value' };
    const expectedValue = { nonEmptyValue: 'value' };
    expect(clearData(data)).toStrictEqual(expectedValue);
  });

  it('should keep NaN', () => {
    const data = { emptyValue: null, nonEmptyValue: NaN };
    const expectedValue = { nonEmptyValue: NaN };
    expect(clearData(data)).toStrictEqual(expectedValue);
  });

  it('should keep 0', () => {
    const data = { emptyValue: undefined, nonEmptyValue: 0 };
    const expectedValue = { nonEmptyValue: 0 };
    expect(clearData(data)).toStrictEqual(expectedValue);
  });

  it('should keep empty array', () => {
    const data = { emptyValue: undefined, nonEmptyValue: [] };
    const expectedValue = { nonEmptyValue: [] };
    expect(clearData(data)).toStrictEqual(expectedValue);
  });

  it('should remove empty array', () => {
    const data = { emptyValue: undefined, nonEmptyValue: [] };
    const expectedValue = {};
    expect(clearData(data, { leaveEmptyArrays: false })).toStrictEqual(expectedValue);
  });

  it('should keep both empty array and empty string', () => {
    const data = { emptyValue: '', nonEmptyValue: [] };
    const expectedValue = data;
    expect(clearData(data, { leaveEmptyStrings: true, leaveEmptyArrays: true })).toStrictEqual(expectedValue);
  });

  it('should keep empty string', () => {
    const data = { emptyValue: '', nonEmptyValue: [] };
    const expectedValue = { emptyValue: '' };
    expect(clearData(data, { leaveEmptyStrings: true })).toStrictEqual(expectedValue);
  });

  it('should remove nested empty values', () => {
    const data = {
      emptyValue: '',
      nonEmptyValue: 'non empty',
      nested: {
        deeper: '',
      },
    };
    const expectedValue = { nonEmptyValue: 'non empty' };
    expect(clearData(data)).toStrictEqual(expectedValue);
  });

  it('should keep nested nonEmpty values', () => {
    const data = {
      emptyValue: '',
      nonEmptyValue: 'non empty',
      nested: {
        deeper: 'have value',
      },
    };
    const expectedValue = {
      nonEmptyValue: 'non empty',
      nested: {
        deeper: 'have value',
      },
    };
    expect(clearData(data)).toStrictEqual(expectedValue);
  });

  it('should trim string values', () => {
    const data = {
      emptyValue: '',
      nonEmptyValue: ' non empty ',
      nested: {
        deeper: ' have value ',
      },
    };
    const expectedValue = {
      nonEmptyValue: 'non empty',
      nested: {
        deeper: 'have value',
      },
    };
    expect(clearData(data)).toStrictEqual(expectedValue);
  });
});
