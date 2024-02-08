import i18n from 'i18next';

export const validatorIsValidNumber = (value): string | boolean => {
  const errorMessage = i18n.t(`common:validation.decimalsNumbers`);
  return !isNaN(Number(value)) || errorMessage;
};
