import { validatorPastTime } from '@validators';

describe('validatorPastTime', () => {
  test('should return true if value is null and not valid', () => {
    const compareTime = new Date();
    const errorMessage = 'Error message';

    const validate = validatorPastTime(compareTime, errorMessage);
    const result = validate(null);

    expect(result).toBe(true);
  });

  test('should return true if value is in the future', () => {
    const compareTime = new Date('2023-07-08');
    const errorMessage = 'Error message';

    const validate = validatorPastTime(compareTime, errorMessage);
    const result = validate(new Date('2023-07-09'));

    expect(result).toBe(true);
  });

  test('should return error message if value is in the past', () => {
    const compareTime = new Date('2023-07-08');
    const errorMessage = 'Error message';

    const validate = validatorPastTime(compareTime, errorMessage);
    const result = validate(new Date('2023-07-07'));

    expect(result).toBe(errorMessage);
  });

  test('should return error message if value is invalid', () => {
    const compareTime = new Date();
    const errorMessage = 'Error message';

    const validate = validatorPastTime(compareTime, errorMessage);
    const result = validate('invalid-date');

    expect(result).toBe(errorMessage);
  });
});
