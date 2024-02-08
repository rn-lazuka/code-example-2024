import i18n from 'i18next';
import { numbersDecimalsReg } from '../regexp';

export const validatorNumberDecimal = () => ({
  value: numbersDecimalsReg,
  message: i18n.t(`common:validation.decimalsNumbers`),
});
