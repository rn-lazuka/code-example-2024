import i18n from 'i18next';

export const validatorDecimalAmountIsInRange =
  (minAmount = 0, maxAmount = 1, errorMessage = i18n.t(`common:validation.amountOfDecimal`)) =>
  (value) => {
    const decimalLength = value.toString().split('.')[1]?.length || 0;
    return (decimalLength >= minAmount && decimalLength <= maxAmount) || errorMessage;
  };
