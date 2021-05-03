import { useCallback, useEffect } from 'react';

/**
 * Used to prevent manual navigation/refresh etc.
 */
export const usePreventUnload = (shouldPrevent: boolean) => {
  const preventReload = useCallback((event) => {
    event.preventDefault();
    event.returnValue = '';
  }, []);

  useEffect(() => {
    if (shouldPrevent) {
      window.addEventListener('beforeunload', preventReload);
    }
    return () => {
      if (shouldPrevent) {
        window.removeEventListener('beforeunload', preventReload);
      }
    };
  }, [shouldPrevent, preventReload]);
};
