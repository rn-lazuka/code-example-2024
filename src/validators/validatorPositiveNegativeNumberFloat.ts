import i18n from 'i18next';
import { positiveNegativeNumbersFloatReg } from '../regexp';

export const validatorPositiveNegativeNumberFloat = () => ({
  value: positiveNegativeNumbersFloatReg,
  message: i18n.t(`common:validation.numbersField`),
});
