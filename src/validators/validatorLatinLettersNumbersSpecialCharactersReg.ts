import i18n from 'i18next';
import { latinLettersNumbersSpecialCharactersReg } from '../regexp';

export const validatorLatinLettersNumbersSpecialCharacters = () => ({
  value: latinLettersNumbersSpecialCharactersReg,
  message: i18n.t(`common:validation.latinLettersNumbersAndSymbols`),
});
