import i18n from 'i18next';
import { isAfter, isValid, subYears, subDays } from 'date-fns';
import isNull from 'lodash/isNull';
import { getTenantEndCurrentDay } from '@utils/getTenantDate';

export const validatorMinYearAgo = (minYears, validationMessage?: string) => (value: any) => {
  const errorMessage = i18n.t(`common:validation.noMoreThanYearsAgo`, { years: minYears });
  if (isNull(value)) return true;

  return (
    (value && isValid(value) && isAfter(value as Date, subDays(subYears(getTenantEndCurrentDay(), minYears), 1))) ||
    validationMessage ||
    errorMessage
  );
};
