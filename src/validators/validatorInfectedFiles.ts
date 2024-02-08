import i18n from 'i18next';

export const validatorInfectedFiles = (infectedFileKeys: string[]) => (value) => {
  const infectedFiles = value.filter((file) =>
    infectedFileKeys.find((infectedFileKey) => infectedFileKey.includes(file.tempKey)),
  );
  const message = i18n.t('common:fileUpload.fileWasInfected');

  return !infectedFiles.length || message;
};
