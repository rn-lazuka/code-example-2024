import i18n from 'i18next';
import { positiveNegativeNumbersReg } from '../regexp';

export const validatorPositiveNegativeNumberInt = () => ({
  value: positiveNegativeNumbersReg,
  message: i18n.t(`common:validation.numbersField`),
});
