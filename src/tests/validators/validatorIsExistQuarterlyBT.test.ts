import { ClinicalScheduleEventType } from '@enums';
import { validatorIsExistQuarterlyBT } from '@validators';

describe('validatorIsExistQuarterlyBT', () => {
  it('should return true if value is null or not a valid date or eventType is not QuarterlyBloodTest', () => {
    const eventType = 'SomeEventType';
    const events = {};
    const editedEventId = '123';
    const validator = validatorIsExistQuarterlyBT(eventType, events, editedEventId);

    expect(validator(null)).toBe(true);

    expect(validator('2023-07-07')).toBe(true);

    expect(validator(ClinicalScheduleEventType.QuarterlyBloodTest)).toBe(true);
  });

  it('should return false if QuarterlyBloodTest event already exists and editedEventId is different', () => {
    const eventType = ClinicalScheduleEventType.QuarterlyBloodTest;
    const events = {
      6: {
        '2023-07-07': [{ type: ClinicalScheduleEventType.QuarterlyBloodTest, id: '456' }],
      },
    };
    const editedEventId = '123';
    const errorMessage = 'schedule:validation.isExistQuarterlyBT';
    const validator = validatorIsExistQuarterlyBT(eventType, events, editedEventId);

    expect(validator(new Date('2023-07-07'))).toBe(errorMessage);

    expect(validator(new Date('2023-07-08'))).toBe(true);
  });
});
