import i18n from 'i18next';
import { isValid, compareAsc } from 'date-fns';
import isNull from 'lodash/isNull';
import { getTenantStartCurrentDay } from '@utils/getTenantDate';

export const validatorPastDate = (value) => {
  const errorMessage = i18n.t(`common:validation.cannotBePast`);
  if (isNull(value)) return true;

  const tenantStartCurrentDate = getTenantStartCurrentDay();

  return (value && isValid(value) && compareAsc(tenantStartCurrentDate, value) !== 1) || errorMessage;
};
