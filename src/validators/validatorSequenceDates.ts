import i18n from 'i18next';
import { isAfter, isValid, startOfDay, isEqual } from 'date-fns';
import isNull from 'lodash/isNull';

export const validatorSequenceDates =
  (pastDate: Date | null, index: number, message = i18n.t(`common:validation.notEarlierThanDay`, { index })) =>
  (value) => {
    if (isNull(value) || isNull(pastDate)) return true;

    if (!isValid(pastDate)) return true;
    if (!isValid(value)) return true;

    const valueStart = startOfDay(value);
    const pastDateStart = startOfDay(pastDate!);

    return (
      (value && isValid(value) && (isAfter(valueStart, pastDateStart) || isEqual(valueStart, pastDateStart))) || message
    );
  };
