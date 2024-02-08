import i18n from 'i18next';

export const validatorMinLength = (minLength, maxLength) => ({
  value: minLength,
  message: i18n.t('common:validation.length', { min: minLength, max: maxLength }),
});
