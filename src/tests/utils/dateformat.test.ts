import { dateFormat, getPassedTimeLabel, to12HourFormat, toAmPmTimeString } from '@utils';

describe('dateformat', () => {
  it('should not fail', () => {
    expect(dateFormat('')).toBe('');
  });

  it('should format date from API', () => {
    const apiDate = '2022-08-31';
    const expectedFormattedDate = '31/08/2022';
    expect(dateFormat(apiDate)).toBe(expectedFormattedDate);
  });
});

describe('to12HourFormat', () => {
  it('should return object with hours, meridian and minutes', () => {
    expect(to12HourFormat(new Date('2022-10-10T10:46:56.983'))).toStrictEqual({
      hours: 10,
      meridian: 'AM',
      minutes: 46,
    });
  });
});

describe('toAmPmTimeString', () => {
  it('should return string with time', () => {
    expect(toAmPmTimeString(new Date('2022-10-10T10:46:56.983'))).toStrictEqual('10:46 AM');
  });
});

describe('getPassedTimeLabel', () => {
  it('should return notification with days ago', async () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    expect(getPassedTimeLabel(yesterday.toDateString())).toStrictEqual('notifications:daysAgo');
  });

  it('should return notification with hours ago', async () => {
    const today = new Date();
    const passedTime = new Date(today);
    passedTime.setTime(passedTime.getTime() - 36000000);
    expect(getPassedTimeLabel(passedTime.toString())).toStrictEqual('notifications:hoursAgo');
  });

  it('should return notification with minutes ago', async () => {
    const today = new Date();
    const passedTime = new Date(today);
    passedTime.setTime(passedTime.getTime() - 360000);
    expect(getPassedTimeLabel(passedTime.toString())).toStrictEqual('notifications:minutesAgo');
  });
});
