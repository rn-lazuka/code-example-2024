import i18n from 'i18next';

export const validatorAutocompleteRequired = () => (data) => {
  const value = data?.label || data?.value || data?.id || data?.uid;
  return value ? true : i18n.t(`common:validation.required`);
};
