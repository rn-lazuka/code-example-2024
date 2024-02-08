import i18n from 'i18next';

export const validatorNumberPositiveNegative = (value) => {
  const errorMessage = i18n.t(`common:validation.numbersPositiveNegative`);
  return Number.isInteger(Number(value)) || errorMessage;
};
