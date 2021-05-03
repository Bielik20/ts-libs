import { useEffect } from 'react';
import { Observable } from 'rxjs';

export function useSubscribe<T>(observable: Observable<T>): void {
  useEffect(() => {
    const subscription = observable.subscribe();

    return () => subscription.unsubscribe();
  }, [observable]);
}
