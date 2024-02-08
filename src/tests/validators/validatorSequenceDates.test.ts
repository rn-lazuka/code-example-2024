import { validatorSequenceDates } from '@validators';

describe('validatorSequenceDates', () => {
  it('returns true if pastDate is null', () => {
    const result = validatorSequenceDates(null, 0)(new Date());
    expect(result).toBe(true);
  });

  it('returns true if value is null', () => {
    const result = validatorSequenceDates(new Date(), 0)(null);
    expect(result).toBe(true);
  });

  it('returns true if pastDate is invalid', () => {
    const result = validatorSequenceDates(new Date('invalid'), 0)(new Date());
    expect(result).toBe(true);
  });

  it('returns true if value is invalid', () => {
    const result = validatorSequenceDates(new Date(), 0)(new Date('invalid'));
    expect(result).toBe(true);
  });

  it('returns true if value is equal to pastDate', () => {
    const pastDate = new Date();
    const value = new Date(pastDate.getTime());
    const result = validatorSequenceDates(pastDate, 0)(value);
    expect(result).toBe(true);
  });

  it('returns true if value is after pastDate', () => {
    const pastDate = new Date();
    const value = new Date(pastDate.getTime() + 1000 * 60 * 60 * 24);
    const result = validatorSequenceDates(pastDate, 0)(value);
    expect(result).toBe(true);
  });

  it('returns validation error if value is before pastDate', () => {
    const pastDate = new Date();
    const value = new Date(pastDate.getTime() - 1000 * 60 * 60 * 24);
    const result = validatorSequenceDates(pastDate, 0)(value);
    expect(result).toBe('common:validation.notEarlierThanDay');
  });
});
