import { getOption } from '@utils';

describe('getOption', () => {
  it('should return an object with label and value properties if both arguments are provided', () => {
    const label = 'Option 1';
    const value = 'option1';
    const result = getOption(label, value);
    expect(result).toEqual({ label, value });
  });

  it('should return an object with label as the value property if only the label argument is provided', () => {
    const label = 'Option 2';
    const result = getOption(label);
    expect(result).toEqual({ label, value: label });
  });

  it('should return null if neither label nor value arguments are provided', () => {
    const result = getOption();
    expect(result).toBeNull();
  });
});
