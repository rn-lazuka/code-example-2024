import { getTenantStartCurrentDay, getTenantYesterdayDate } from '@utils';
import { validatorSameDates } from '@validators';

describe('validatorSameDates', () => {
  const validator = validatorSameDates(
    [
      { shiftId: 'shift_1', date: getTenantStartCurrentDay(), duration: 240 },
      { shiftId: 'shift_2', date: getTenantStartCurrentDay(), duration: 240 },
    ],
    1,
  );

  it('should return true if it has valid value', () => {
    expect(validator(getTenantYesterdayDate())).toEqual(true);
  });

  it('should return true if it has nullable value or no shifts', () => {
    expect(validator(null)).toEqual(true);
    expect(validatorSameDates(null, 1)(new Date())).toEqual(true);
  });

  it('should return error message because value is incorrect', () => {
    expect(validator(getTenantStartCurrentDay())).toEqual('common:validation.sameDay');
  });
});
