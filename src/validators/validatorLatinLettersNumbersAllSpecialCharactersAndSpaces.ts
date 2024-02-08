import { latinLettersNumbersAllSpecialCharactersAndSpacesReg } from '@src/regexp';
import i18n from 'i18next';

export const validatorLatinLettersNumbersAllSpecialCharactersAndSpaces = () => ({
  value: latinLettersNumbersAllSpecialCharactersAndSpacesReg,
  message: i18n.t(`common:validation.latinLettersNumbersAndSymbols`),
});
