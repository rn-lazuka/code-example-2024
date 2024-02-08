import i18n from 'i18next';
import { numbersReg } from '../regexp';

export const validatorNumberInt = () => ({
  value: numbersReg,
  message: i18n.t(`common:validation.numbersField`),
});
