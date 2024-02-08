import i18n from 'i18next';
import { endOfDay, isAfter, isValid } from 'date-fns';
import isNull from 'lodash/isNull';
import { utcToZonedTime } from 'date-fns-tz';
import { getTenantTimeZoneFromStorage } from '@utils/getTenantTimeZoneFromStorage';

export const validatorFutureDate =
  (errorMessage: string | undefined = i18n.t(`common:validation.cannotBeFuture`)) =>
  (value: any) => {
    if (isNull(value) && !isValid(value)) return true;

    const timeZone = getTenantTimeZoneFromStorage();
    const tenantEndCurrentDate = endOfDay(utcToZonedTime(new Date(), timeZone));

    return (value && isValid(value) && isAfter(tenantEndCurrentDate, value)) || errorMessage;
  };
