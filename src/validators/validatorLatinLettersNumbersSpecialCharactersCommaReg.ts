import i18n from 'i18next';
import { latinLettersNumbersSpecialCharactersCommaReg } from '../regexp';

export const validatorLatinLettersNumbersSpecialCharactersComma = () => ({
  value: latinLettersNumbersSpecialCharactersCommaReg,
  message: i18n.t(`common:validation.latinLettersNumbersAndSymbols`),
});
