import { DependencyList, useEffect, useState } from 'react';
import { Observable } from 'rxjs';

export type StreamResult<T> = StreamPendingResult | StreamSuccessResult<T> | StreamErrorResult;
type StreamPendingResult = [status: 'pending', value: null, error: null];
type StreamSuccessResult<T> = [status: 'success', value: T, error: null];
type StreamErrorResult = [status: 'error', value: null, error: Error];

// TODO: support path stream$ and callback with stream (the same for usePromise)
export function useStream<T>(stream$: Observable<T>, deps?: DependencyList): StreamResult<T> {
  const [value, setValue] = useState<StreamResult<T>>(['pending', null, null]);

  useEffect(() => {
    const subscription = stream$.subscribe(
      (value) => setValue(['success', value, null]),
      (error) => setValue(['error', null, error]),
    );

    return () => {
      subscription.unsubscribe();
      setValue(['pending', null, null]);
    };
  }, deps);

  return value;
}
