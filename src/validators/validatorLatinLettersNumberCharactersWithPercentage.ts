import { latinLettersNumbersCharactersRegWithPercentage } from '@src/regexp';
import i18n from 'i18next';

export const validatorLatinLettersNumberCharactersWithPercentage = () => ({
  value: latinLettersNumbersCharactersRegWithPercentage,
  message: i18n.t(`common:validation.latinLettersNumbersAndSymbols`),
});
