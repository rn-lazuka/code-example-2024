import i18n from 'i18next';
import { isValid, format } from 'date-fns';
import isNull from 'lodash/isNull';
import { DateShifts } from '@types';

export const validatorSameDates = (shifts: DateShifts[] | null, index: number) => (value) => {
  if (isNull(value) || !isValid(value) || !shifts) return true;
  const sameDate = shifts.find(
    (shift, i) => (shift.date && format(shift.date, 'yyyy-MM-dd')) === format(value, 'yyyy-MM-dd') && index !== i,
  );

  return sameDate ? i18n.t(`common:validation.sameDay`) : true;
};
