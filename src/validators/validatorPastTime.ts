import i18n from 'i18next';
import { isBefore, isValid } from 'date-fns';
import isNull from 'lodash/isNull';
import { getTenantDate } from '@utils';

export const validatorPastTime =
  (compareTime = getTenantDate(), errorMessage: string | undefined = i18n.t(`common:validation.cannotBePast`)) =>
  (value: any) => {
    if (isNull(value) && !isValid(value)) return true;
    return (value && isValid(value) && isBefore(compareTime, value)) || errorMessage;
  };
