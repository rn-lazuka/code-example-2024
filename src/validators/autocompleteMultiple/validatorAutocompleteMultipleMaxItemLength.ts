import i18n from 'i18next';

export const validatorAutocompleteMultipleMaxItemLength =
  (minLength: number, maxLength: number) => (data: string[]) => {
    const isError = data.some((value) => maxLength < value.length);
    return isError ? i18n.t('common:validation.length', { min: minLength, max: maxLength }) : true;
  };
