import type { PayloadAction } from '@reduxjs/toolkit';
import { useAppDispatch } from '@hooks/storeHooks';
import { useEffect } from 'react';

type Payload = PayloadAction<any> | false | null | undefined;

export const useDispatchOnUnmount = (...payloads: Payload[]) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      payloads.forEach((payload) => payload && dispatch(payload));
    };
  }, []);
};
