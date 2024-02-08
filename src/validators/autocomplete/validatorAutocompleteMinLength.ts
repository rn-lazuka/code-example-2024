import i18n from 'i18next';

export const validatorAutocompleteMinLength =
  (minLength: number, maxLength: number, field = 'value') =>
  (data) => {
    const value = data?.[field] || data?.label;
    return value && minLength > value.length
      ? i18n.t('common:validation.length', { min: minLength, max: maxLength })
      : true;
  };
