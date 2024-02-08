import i18n from 'i18next';

export const validatorMaxFileCount = (maxCount) => (value) => {
  const errorMessage = i18n.t(`common:validation.maxNumberOfDocuments`);
  return value.length <= maxCount || errorMessage;
};
