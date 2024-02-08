import i18n from 'i18next';

export const validatorMaxFileSize = (maxSize) => (value) => {
  const errorFiles = value.filter((file) => file.size > maxSize);
  const errorMessage = i18n.t(`common:validation.maxFileSize`);
  return errorFiles.length === 0 || errorMessage;
};
