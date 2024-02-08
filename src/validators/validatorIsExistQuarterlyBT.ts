import isNull from 'lodash/isNull';
import { format, getMonth, isValid } from 'date-fns';
import { ClinicalScheduleEventType } from '@enums/pages/Schedule';
import i18n from 'i18next';

export const validatorIsExistQuarterlyBT = (eventType, events, editedEventId) => (value) => {
  if (isNull(value) || !isValid(value) || eventType !== ClinicalScheduleEventType.QuarterlyBloodTest) return true;

  const errorMessage = i18n.t(`schedule:validation.isExistQuarterlyBT`);
  const monthEvents = events[getMonth(value)];
  const dayEvents = monthEvents[format(value, 'yyyy-MM-dd')] || [];
  const isExist = dayEvents.some(
    ({ type, id }) => type === ClinicalScheduleEventType.QuarterlyBloodTest && id !== editedEventId,
  );
  return !isExist || errorMessage;
};
