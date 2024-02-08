import { checkIsDataValidToPeriod } from '@utils/checkIsDataValidToPeriod';

describe('checkIsDataValidToPeriod', () => {
  it('should return null if data is valid', () => {
    expect(checkIsDataValidToPeriod(new Date('2022-11-28'), new Date('2022-11-11'))).toBeNull();
  });

  it('should return notEarlierThan error if data is earlier than passed prop', () => {
    expect(checkIsDataValidToPeriod(new Date('2022-11-10'), new Date('2022-11-11'))).toBe(
      'common:validation.notEarlierThan',
    );
  });

  it('should return notEarlierThan error if data is earlier than passed prop', () => {
    expect(checkIsDataValidToPeriod(new Date('2028-11-29'), new Date('2022-11-11'))).toBe(
      'common:validation.cannotBeFuture',
    );
  });

  it('should return validError if data is not valid', () => {
    expect(checkIsDataValidToPeriod('2028-29-29', new Date('2022-11-11'))).toBe('common:validation.invalidDate');
  });
});
