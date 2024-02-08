import i18n from 'i18next';
import { dateToServerFormat, getTenantDate } from '@utils';

interface ValidatorDateIsInRangeProps {
  dateFrom: Date;
  dateTo: Date;
  errorMessage?: string;
  convertToTenantDate?: boolean;
}

export const validatorDateIsInRange =
  ({
    dateFrom,
    dateTo,
    errorMessage = i18n.t('common:validation.shouldBeInRange', {
      dateFrom: dateToServerFormat(dateFrom),
      dateTo: dateToServerFormat(dateTo),
    }),
    convertToTenantDate = true,
  }: ValidatorDateIsInRangeProps) =>
  (value) => {
    const valueToCompare = convertToTenantDate ? getTenantDate(value) : value;
    return (
      (valueToCompare.getTime() >= dateFrom.getTime() && valueToCompare.getTime() <= dateTo.getTime()) || errorMessage
    );
  };
