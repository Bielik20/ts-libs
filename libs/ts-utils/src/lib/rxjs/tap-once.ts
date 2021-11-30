import { filter, merge, MonoTypeOperatorFunction, Observable, Observer, take, tap } from 'rxjs';

export function tapOnce<T>(next: (value: T) => void): MonoTypeOperatorFunction<T>;
export function tapOnce<T>(observer?: Partial<Observer<T>>): MonoTypeOperatorFunction<T>;
export function tapOnce<T>(
  observerOrNext?: Partial<Observer<T>> | ((value: T) => void) | null,
): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => {
    const tapSource = source.pipe(
      take(1),
      tap(observerOrNext as any),
      filter(() => false),
    );

    return merge(tapSource, source);
  };
}
