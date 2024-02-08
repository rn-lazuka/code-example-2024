import i18n from 'i18next';
import { latinLettersNumbersCharactersReg } from '../regexp';

export const validatorLatinLettersNumberCharacters = () => ({
  value: latinLettersNumbersCharactersReg,
  message: i18n.t(`common:validation.latinLettersNumbersAndSymbols`),
});
