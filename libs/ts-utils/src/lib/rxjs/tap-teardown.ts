import { Observable } from 'rxjs';

export function tapTeardown(teardownCb: () => void) {
  return <T>(source: Observable<T>): Observable<T> =>
    new Observable<T>((observer) => {
      const subscription = source.subscribe(observer);

      return () => {
        subscription.unsubscribe();
        teardownCb();
      };
    });
}
