import i18n from 'i18next';
import { latinLettersNumbersAllSpecialCharactersReg } from '../regexp';

export const validatorLatinLettersNumbersAllSpecialCharacters = () => ({
  value: latinLettersNumbersAllSpecialCharactersReg,
  message: i18n.t(`common:validation.latinLettersNumbersAndSymbols`),
});
