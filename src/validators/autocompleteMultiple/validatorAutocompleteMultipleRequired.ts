import i18n from 'i18next';

export const validatorAutocompleteMultipleRequired = () => (data: string[]) => {
  return data?.length > 0 ? true : i18n.t(`common:validation.required`);
};
