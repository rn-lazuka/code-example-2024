import i18n from 'i18next';

export const validatorMoreLessNumber = () => ({
  value: /^[<,>]?\d+(\.\d+|,\d+)?$/,
  message: i18n.t(`common:validation.moreLessNumber`),
});
