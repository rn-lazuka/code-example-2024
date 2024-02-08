import i18n from 'i18next';

export const validatorNotZero = (value) => {
  const errorMessage = i18n.t(`common:validation.notZero`);
  return parseFloat(value) !== 0 || errorMessage;
};
