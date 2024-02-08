import { isValid, startOfDay, isSameDay } from 'date-fns';
import { getTenantStartCurrentDay } from '@utils';
import i18n from 'i18next';

export const validatorHasTodayEncounter = (hasEncounter: boolean) => (value) => {
  if (value && isValid(value)) {
    const tenantStartCurrentDay = getTenantStartCurrentDay();
    const startValue = startOfDay(value);
    if (isSameDay(tenantStartCurrentDay, startValue)) {
      const errorMessage = i18n.t('common:validation.servicesPerformed') || '';
      return !hasEncounter || errorMessage;
    }
  }
  return true;
};
