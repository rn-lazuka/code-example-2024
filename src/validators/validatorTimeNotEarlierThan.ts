import i18n from 'i18next';
import { isAfter, isValid, isEqual } from 'date-fns';
import isNull from 'lodash/isNull';

export const validatorTimeNotEarlierThan = (pastDate?: Date | null, errorMessage?: string) => (value) => {
  if (isNull(value) || isNull(pastDate)) return true;
  if (!isValid(pastDate)) return true;

  return (
    (value && isValid(value) && pastDate && (isAfter(value, pastDate) || isEqual(value, pastDate))) ||
    errorMessage ||
    i18n.t('common:validation.endTimeCanNotBeEarlier')
  );
};
