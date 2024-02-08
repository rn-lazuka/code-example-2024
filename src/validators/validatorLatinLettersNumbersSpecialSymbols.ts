import i18n from 'i18next';
import { latinLettersNumbersSpecialSymbolsReg } from '../regexp';

export const validatorLatinLettersNumbersSpecialSymbols = () => ({
  value: latinLettersNumbersSpecialSymbolsReg,
  message: i18n.t(`common:validation.latinLettersNumbersSpecialSymbols`),
});
