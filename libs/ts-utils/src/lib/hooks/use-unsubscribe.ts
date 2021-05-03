import { useEffect } from 'react';
import { Observable, Subject } from 'rxjs';
import useConstant from 'use-constant';

export function useUnsubscribe(): Observable<void> {
  const unsubscribe$ = useConstant(() => new Subject<void>());

  useEffect(() => {
    return () => {
      unsubscribe$.next();
      unsubscribe$.complete();
    };
  }, []);

  return unsubscribe$;
}
