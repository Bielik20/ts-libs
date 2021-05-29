import { DependencyList, useEffect, useState } from 'react';
import {
  ErrorResult,
  makeErrorResult,
  makeSuccessResult,
  PENDING_RESULT,
  PendingResult,
  SuccessResult,
} from '../utils/results';

export type PromiseResult<T> = PendingResult | SuccessResult<T> | ErrorResult;

export function usePromise<T>(factory: () => Promise<T>, deps?: DependencyList): PromiseResult<T> {
  const [value, setValue] = useState<PromiseResult<T>>(PENDING_RESULT);

  useEffect(() => {
    let ended = false;
    const expression = async () => {
      try {
        const value = await factory();

        if (!ended) {
          setValue(makeSuccessResult(value));
        }
      } catch (error) {
        if (!ended) {
          setValue(makeErrorResult(error));
        }
      }
    };

    expression();

    return () => {
      ended = true;
      setValue(PENDING_RESULT);
    };
  }, deps);

  return value;
}
