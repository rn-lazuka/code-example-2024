import { isBefore, isEqual, isValid, startOfDay } from 'date-fns';
import isNull from 'lodash/isNull';
import i18n from 'i18next';

export const validatorMaxDate =
  (maxDate: Date, fieldName: string | undefined, errorMessage: string) => (value: any) => {
    if (isNull(value)) return true;
    if (!isValid(maxDate) && fieldName) return i18n.t('common:validation.checkFieldValue', { field: fieldName });
    return (
      (value && isValid(value) && (isEqual(startOfDay(value), maxDate) || isBefore(value as Date, maxDate))) ||
      errorMessage
    );
  };
