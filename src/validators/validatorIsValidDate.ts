import i18n from 'i18next';
import { isValid } from 'date-fns';
import isNull from 'lodash/isNull';

export const validatorIsValidDate = (value) => {
  const errorMessage = i18n.t(`common:validation.invalidDate`);
  if (isNull(value)) return true;
  return (value && isValid(value) && value.getFullYear() >= 1000) || errorMessage;
};
