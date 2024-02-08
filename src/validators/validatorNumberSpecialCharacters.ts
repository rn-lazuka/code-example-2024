import i18n from 'i18next';
import { numbersSpecialCharactersReg } from '../regexp';

export const validatorNumberSpecialCharacters = () => ({
  value: numbersSpecialCharactersReg,
  message: i18n.t(`common:validation.latinLetters`),
});
