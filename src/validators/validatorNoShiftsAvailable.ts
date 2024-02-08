import { format, isValid } from 'date-fns';
import i18n from 'i18next';
import isNull from 'lodash/isNull';

export const validatorNoShiftsAvailable =
  (availableDays: string[], errorMessage = i18n.t('common:validation.noShifts')) =>
  (date) => {
    if (isNull(date) || !isValid(date)) return true;
    return availableDays.includes(format(date, 'yyyy-MM-dd')) ? true : errorMessage;
  };
