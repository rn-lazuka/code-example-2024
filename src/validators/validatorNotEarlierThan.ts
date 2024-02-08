import i18n from 'i18next';
import { isAfter, isValid, format, startOfDay, isEqual } from 'date-fns';
import isNull from 'lodash/isNull';

export const validatorNotEarlierThan = (pastDate: Date | null) => (value) => {
  if (isNull(value)) return true;
  if (isNull(pastDate)) return i18n.t(`common:validation.enterStartDate`);
  if (!isValid(pastDate)) return true;
  const valueStart = startOfDay(value);
  const pastDateStart = startOfDay(pastDate!);

  return (
    (value && isValid(value) && (isAfter(valueStart, pastDateStart) || isEqual(valueStart, pastDateStart))) ||
    i18n.t(`common:validation.notEarlierThan`, { date: format(pastDate!, 'dd/MM/yyyy') })
  );
};
