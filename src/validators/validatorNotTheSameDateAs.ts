import isNull from 'lodash/isNull';
import { format, isValid } from 'date-fns';
import i18n from 'i18next';

export const validatorNotTheSameDateAs = (dateToCompare: Date, dateName: string) => (value) => {
  if (isNull(value)) return true;

  return (
    (value && isValid(value) && format(dateToCompare, 'dd/MM/yyyy') !== format(value, 'dd/MM/yyyy')) ||
    i18n.t(`common:validation.notTheSameDateAs`, { dateName })
  );
};
