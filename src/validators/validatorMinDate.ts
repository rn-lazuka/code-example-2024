import { isAfter, isEqual, isValid } from 'date-fns';
import isNull from 'lodash/isNull';

export const validatorMinDate = (minDate: Date, errorMessage: string) => (value: any) => {
  if (isNull(value)) return true;

  return (
    (value && isValid(value) && (isEqual(value as Date, minDate) || isAfter(value as Date, minDate))) || errorMessage
  );
};
