import { useEffect } from 'react';
import { useAppDispatch } from './storeHooks';
import { logOut } from '../store/slices/userSlice';

export const useCheckTokenStorage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleInvalidToken = (e) => {
      if (e.key === 'access_token' && e.oldValue && !e.newValue) {
        dispatch(logOut());
      }
    };

    window.addEventListener('storage', handleInvalidToken);

    return () => {
      window.removeEventListener('storage', handleInvalidToken);
    };
  }, []);
};
