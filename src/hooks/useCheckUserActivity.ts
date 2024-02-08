import { useEffect } from 'react';
import { useAppDispatch } from '@hooks/storeHooks';
import { systemUpdatePageFocus } from '@store/slices/systemSlice';

export const useCheckUserActivity = () => {
  useEffect(() => {
    const setActivityStamp = () => {
      localStorage.setItem('lastActivityTimeStamp', JSON.stringify(new Date().getTime()));
    };
    setActivityStamp();

    window.addEventListener('touchend', setActivityStamp);
    window.addEventListener('mousemove', setActivityStamp);
    window.addEventListener('keypress', setActivityStamp);
    window.addEventListener('click', setActivityStamp);

    return () => {
      window.removeEventListener('touchend', setActivityStamp);
      window.removeEventListener('mousemove', setActivityStamp);
      window.removeEventListener('keypress', setActivityStamp);
      window.removeEventListener('click', setActivityStamp);
    };
  }, []);
};

export const useCheckPageActivity = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isActive = !document.hidden;
      if (!isActive) {
        localStorage.setItem('lastPageActivityTimeStamp', JSON.stringify(new Date().getTime()));
      }
      dispatch(systemUpdatePageFocus({ isActive }));
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
};
