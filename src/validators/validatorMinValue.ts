import i18n from 'i18next';

export const validatorMinValue = (minValue, maxValue) => ({
  value: minValue,
  message: i18n.t('common:validation.minMaxValue', { min: minValue, max: maxValue }),
});
