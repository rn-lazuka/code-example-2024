import { RestDay } from '@enums';
import { enUS } from 'date-fns/locale';

export const getAdapterLocale = (restDay: RestDay) => {
  const localeConfig = {
    ...enUS,
    options: { ...enUS.options, weekStartsOn: 1 as any },
  };

  if (restDay === RestDay.FRIDAY) {
    localeConfig.options = {
      ...localeConfig.options,
      weekStartsOn: 6 as any,
    };
  }

  return localeConfig;
};
