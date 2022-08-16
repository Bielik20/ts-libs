import { DependencyList, useEffect } from 'react';
import { Observable, Subject } from 'rxjs';
import { useConstant } from './use-constant';

export function useUnsubscribe(deps: DependencyList | undefined): Observable<void> {
  const unsubscribe$ = useConstant(() => new Subject<void>());

  useEffect(() => {
    return () => {
      unsubscribe$.next();
      unsubscribe$.complete();
    };
  }, deps);

  return unsubscribe$;
}
