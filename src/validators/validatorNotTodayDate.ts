import i18n from 'i18next';
import isNull from 'lodash/isNull';
import { isValid, endOfDay, compareAsc } from 'date-fns';
import { getTenantEndCurrentDay } from '@utils/getTenantDate';

export const validatorNotTodayDate =
  (errorMessage: string | undefined = i18n.t('common:validation.cannotBeToday')) =>
  (value: Date | null) => {
    if (isNull(value)) return true;

    return (value && isValid(value) && compareAsc(getTenantEndCurrentDay(), endOfDay(value)) !== 0) || errorMessage;
  };
