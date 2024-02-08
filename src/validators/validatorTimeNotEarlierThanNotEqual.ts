import i18n from 'i18next';
import { isAfter, isValid } from 'date-fns';
import isNull from 'lodash/isNull';

export const validatorTimeNotEarlierThanNotEqual = (pastDate?: Date | null, errorMessage?: string) => (value) => {
  if (isNull(value) || isNull(pastDate)) return true;
  if (!isValid(pastDate)) return true;

  return (
    (value && isValid(value) && pastDate && isAfter(value, pastDate)) ||
    errorMessage ||
    i18n.t('common:validation.endTimeCanNotBeEarlier')
  );
};
