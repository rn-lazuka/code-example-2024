import i18n from 'i18next';

export const validatorAutocompleteDecimalAmountIsInRange =
  (minAmount = 0, maxAmount = 1, field = 'value', errorMessage = i18n.t(`common:validation.amountOfDecimal`)) =>
  (data) => {
    const value = data?.[field] || data?.label;
    const decimalLength = value.toString().split('.')[1]?.length || 0;
    return (decimalLength >= minAmount && decimalLength <= maxAmount) || errorMessage;
  };
