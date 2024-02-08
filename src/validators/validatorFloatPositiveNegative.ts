import i18n from 'i18next';

export const validatorFloatPositiveNegative = (value) => {
  const errorMessage = i18n.t(`common:validation.numbersPositiveNegative`);
  return Number.isFinite(Number(value)) || errorMessage;
};
