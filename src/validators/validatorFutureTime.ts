import i18n from 'i18next';
import { isAfter, isEqual, isValid } from 'date-fns';
import isNull from 'lodash/isNull';
import { getTenantDate } from '@utils';

export const validatorFutureTime =
  (compareTime = getTenantDate(), errorMessage: string | undefined = i18n.t(`common:validation.cannotBeFuture`)) =>
  (value: any) => {
    if (isNull(value) && !isValid(value)) return true;
    return (value && isValid(value) && (isAfter(compareTime, value) || isEqual(compareTime, value))) || errorMessage;
  };
