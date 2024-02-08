import { validatorMinDate } from '@validators';
import { DAY } from '@constants';

describe('validatorMinDate', () => {
  const twoDaysAgoDate = new Date(new Date().getTime() - DAY * 2);
  const yesterdayDate = new Date(new Date().getTime() - DAY);
  const todayDate = new Date();
  const errorMessage = 'Error message';
  const validator = validatorMinDate(yesterdayDate, errorMessage);

  it("should return true if it's null", () => {
    expect(validator(null)).toEqual(true);
  });

  it('should return true if it has valid value', () => {
    expect(validator(todayDate)).toEqual(true);
  });

  it('should return true if it has invalid value', () => {
    expect(validator(twoDaysAgoDate)).toEqual(errorMessage);
  });
});
