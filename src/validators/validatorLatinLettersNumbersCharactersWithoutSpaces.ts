import i18n from 'i18next';
import { latinLettersNumbersCharactersWithoutSpacesReg } from '../regexp';

export const validatorLatinLettersNumbersCharactersWithoutSpaces = () => ({
  value: latinLettersNumbersCharactersWithoutSpacesReg,
  message: i18n.t(`common:validation.latinLettersNumbersAndSymbolsWithoutSpaces`),
});
