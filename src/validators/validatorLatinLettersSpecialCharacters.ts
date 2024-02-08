import i18n from 'i18next';
import { latinLettersSpecialCharactersReg } from '../regexp';

export const validatorLatinLettersSpecialCharacters = () => ({
  value: latinLettersSpecialCharactersReg,
  message: i18n.t(`common:validation.name`),
});
