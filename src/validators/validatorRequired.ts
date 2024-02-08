import i18n from 'i18next';

export const validatorRequired = () => ({
  value: true,
  message: i18n.t(`common:validation.required`),
});
