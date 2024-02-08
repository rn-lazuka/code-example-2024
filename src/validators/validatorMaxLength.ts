import i18n from 'i18next';

export const validatorMaxLength = (minLength, maxLength) => ({
  value: maxLength,
  message: i18n.t('common:validation.length', { min: minLength, max: maxLength }),
});
