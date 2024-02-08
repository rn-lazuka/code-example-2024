import i18n from 'i18next';
import { numbersDecimalsReg } from '@src/regexp';

export const validatorAutocompleteNumberDecimal =
  (field = 'value') =>
  (data) => {
    const value = data?.[field] || data?.label;
    return !value || (value && new RegExp(numbersDecimalsReg).test(value))
      ? true
      : i18n.t(`common:validation.decimalsNumbers`);
  };
