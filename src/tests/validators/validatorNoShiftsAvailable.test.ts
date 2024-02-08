import { validatorNoShiftsAvailable } from '@validators';

const availableDays = ['2022-01-01', '2022-01-02', '2022-01-03'];

describe('validatorNoShiftsAvailable', () => {
  it('should return true if date is valid and available in availableDays', () => {
    const date = new Date(2022, 0, 2);
    expect(validatorNoShiftsAvailable(availableDays)(date)).toBe(true);
  });

  it('should return error message if date is valid and not available in availableDays', () => {
    const date = new Date(2022, 0, 4);
    const expectedMessage = 'common:validation.noShifts';
    expect(validatorNoShiftsAvailable(availableDays)(date)).toBe(expectedMessage);
  });

  it('should return true if date is invalid', () => {
    const date = new Date('invalid date');
    expect(validatorNoShiftsAvailable(availableDays)(date)).toBe(true);
  });

  it('should return true if date is null', () => {
    const date = null;
    expect(validatorNoShiftsAvailable(availableDays)(date)).toBe(true);
  });
});
