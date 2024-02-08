import i18n from 'i18next';
import { format, isBefore, isValid } from 'date-fns';
import isNull from 'lodash/isNull';

export const validatorTimeNotLaterThanNotEqual = (futureDate: Date, errorMessage?: string) => (value) => {
  if (isNull(value)) return true;
  if (!isValid(futureDate)) return true;

  return (
    (value && isValid(value) && isBefore(value, futureDate)) ||
    errorMessage ||
    i18n.t('common:validation.enteredDateShouldNotBeLaterThan', { date: format(futureDate, 'dd/MM/yyyy') })
  );
};
