import { getObjectKeyByValue } from '@utils';

const obj = { a: 1, b: 2, c: 3 };

describe('getObjectKeyByValue', () => {
  it('should return the key that matches the provided value', () => {
    const value = 2;
    const result = getObjectKeyByValue(value, obj);
    expect(result).toBe('b');
  });

  it('should return undefined if the value is not found in the object', () => {
    const value = 4;
    const result = getObjectKeyByValue(value, obj);
    expect(result).toBeUndefined();
  });
});
