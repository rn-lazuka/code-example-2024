import { useEffect } from 'react';

/** Watching page refresh, tab close, browser close attempts and showing confirm modal if condition is true */
export const usePageUnload = (condition: boolean, message: string) => {
  useEffect(() => {
    const callback = (event) => {
      event.preventDefault();
      if (condition) {
        // Chrome requires setting returnValue
        event.returnValue = message;
      }
    };
    window.addEventListener('beforeunload', callback, { capture: true });

    return () => {
      window.removeEventListener('beforeunload', callback, { capture: true });
    };
  }, [condition]);
};
