import i18n from 'i18next';

export const validatorMaxValue = (minValue, maxValue) => ({
  value: maxValue,
  message: i18n.t('common:validation.minMaxValue', { min: minValue, max: maxValue }),
});
