import i18n from 'i18next';

export const validatorTimeDurationIsInRange = (minDuration: number, maxDuration: number) => (value) => {
  const errorMessage = i18n.t(`common:validation.durationTime`, { min: minDuration / 60, max: maxDuration / 60 });
  return (value >= minDuration && value <= maxDuration) || errorMessage;
};
