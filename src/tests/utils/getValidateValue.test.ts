import { validateDataValue, validateDateValue } from '@utils';

describe('validateDataValue', () => {
  it('Should return data if value is valid', () => {
    expect(validateDataValue([{ example: 'dummy1' }], [])).toStrictEqual([{ example: 'dummy1' }]);
  });

  it('Should return default data [] if value is invalid', () => {
    expect(validateDataValue(undefined, [])).toStrictEqual([]);
  });

  it('Should return default data {} if value is invalid', () => {
    expect(validateDataValue(undefined, {})).toStrictEqual({});
  });

  it('Should return default data "" if value is invalid', () => {
    expect(validateDataValue(undefined, '')).toStrictEqual('');
  });

  it('Should return default data null if value is invalid', () => {
    expect(validateDataValue(undefined, null)).toStrictEqual(null);
  });
});

describe('validateDateValue', () => {
  it('Should return data with format given if value is valid', () => {
    expect(validateDateValue('2022-02-22T02:41:26.000Z', null, 'yyyy-MM-dd')).toStrictEqual('2022-02-22');
  });

  it('Should return null if value is invalid', () => {
    expect(validateDateValue(undefined, null, 'yyyy-MM-dd')).toStrictEqual(null);
  });
});
