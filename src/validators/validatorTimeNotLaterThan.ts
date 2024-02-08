import i18n from 'i18next';
import { isBefore, isValid, isEqual, format } from 'date-fns';
import isNull from 'lodash/isNull';

export const validatorTimeNotLaterThan = (futureDate: Date, errorMessage?: string) => (value) => {
  if (isNull(value)) return true;
  if (!isValid(futureDate)) return true;

  return (
    (value && isValid(value) && (isBefore(value, futureDate) || isEqual(value, futureDate))) ||
    errorMessage ||
    i18n.t('common:validation.enteredDateShouldNotBeLaterThan', { date: format(futureDate, 'dd/MM/yyyy') })
  );
};
