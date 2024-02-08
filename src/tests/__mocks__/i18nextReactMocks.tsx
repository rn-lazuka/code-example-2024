import React, { PropsWithChildren } from 'react';
import * as i18nextMocks from './i18nextMocks';

export const useTranslation = () => {
  return {
    t: i18nextMocks.mockT,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  };
};

export const Trans = ({ children }: PropsWithChildren<{}>) => <>{children}</>;
