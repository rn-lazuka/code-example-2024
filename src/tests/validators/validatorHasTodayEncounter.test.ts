import { validatorHasTodayEncounter } from '@validators';
import { getTenantYesterdayDate } from '@utils';

describe('validatorHasTodayEncounter', () => {
  it('returns true when value is null or undefined', () => {
    const hasEncounter = true;
    const validate = validatorHasTodayEncounter(hasEncounter);
    expect(validate(null)).toBe(true);
    expect(validate(undefined)).toBe(true);
  });

  it('returns true when value is invalid', () => {
    const hasEncounter = true;
    const validate = validatorHasTodayEncounter(hasEncounter);
    expect(validate('invalid-date')).toBe(true);
  });

  it('returns true when value is not today', () => {
    const hasEncounter = true;
    const validate = validatorHasTodayEncounter(hasEncounter);
    expect(validate(getTenantYesterdayDate())).toBe(true);
  });

  it('returns true when hasEncounter is true', () => {
    const hasEncounter = true;
    const validate = validatorHasTodayEncounter(hasEncounter);
    expect(validate(new Date('2023-04-08T12:34:56Z'))).toBe(true);
  });
});
