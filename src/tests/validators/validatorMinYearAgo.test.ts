import { validatorMinYearAgo } from '@validators';

function subtractYears(date, years) {
  date.setFullYear(date.getFullYear() - years);
  return date;
}

describe('validatorMinYearAgo', () => {
  const todayDate = new Date();
  const errorMessage = 'common:validation.noMoreThanYearsAgo';
  const validator = validatorMinYearAgo(1);

  it("should return true if it's null", () => {
    expect(validator(null)).toEqual(true);
  });

  it('should return true if it has valid value', () => {
    expect(validator(todayDate)).toEqual(true);
  });

  it('should return true if it has invalid value', () => {
    expect(validator(subtractYears(todayDate, 10))).toEqual(errorMessage);
  });
});
