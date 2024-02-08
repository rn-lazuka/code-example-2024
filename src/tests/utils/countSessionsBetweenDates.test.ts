import { countSessionsBetweenDates } from '@utils';
import { DaysOfWeek } from '@enums';

describe('countSessionsBetweenDates', () => {
  it('should return number of sessions between passed days', () => {
    expect(
      countSessionsBetweenDates(new Date('2022-11-11T00:00:00.000Z'), new Date('2022-11-18T00:00:00.000Z'), [
        DaysOfWeek.Monday,
        DaysOfWeek.Friday,
      ]),
    ).toBe(3);
  });
  it('should return zero if not enough data', () => {
    expect(
      countSessionsBetweenDates(null, new Date('2022-11-18T00:00:00.000Z'), [DaysOfWeek.Monday, DaysOfWeek.Friday]),
    ).toBe(0);
  });
});
