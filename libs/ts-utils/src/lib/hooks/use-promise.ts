import { DependencyList, useEffect, useState } from 'react';

export type PromiseResult<T> = PromisePendingResult | PromiseSuccessResult<T> | PromiseErrorResult;
type PromisePendingResult = [status: 'pending', value: null, error: null];
type PromiseSuccessResult<T> = [status: 'success', value: T, error: null];
type PromiseErrorResult = [status: 'error', value: null, error: Error];

export function usePromise<T>(promise: () => Promise<T>, deps?: DependencyList): PromiseResult<T> {
  const [value, setValue] = useState<PromiseResult<T>>(['pending', null, null]);

  useEffect(() => {
    let ended = false;
    const expression = async () => {
      try {
        const value = await promise();

        if (!ended) {
          setValue(['success', value, null]);
        }
      } catch (error) {
        if (!ended) {
          setValue(['error', null, error]);
        }
      }
    };

    expression();

    return () => {
      ended = true;
      setValue(['pending', null, null]);
    };
  }, deps);

  return value;
}
