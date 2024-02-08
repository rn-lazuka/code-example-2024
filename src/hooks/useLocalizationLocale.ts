import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { selectRestDay } from '@store/slices';
import { getAdapterLocale } from '@utils/adapterLocale';
import { useMemo } from 'react';

type LocaleAndAdapter = {
  locale: any;
  adapter: typeof AdapterDateFns;
};

export const useLocalizationLocale = (): LocaleAndAdapter => {
  const restDay = selectRestDay();
  const locale = useMemo(() => getAdapterLocale(restDay), [restDay]);

  return { locale, adapter: AdapterDateFns };
};
