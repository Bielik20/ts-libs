import { FactoryOrValue, Falsy, unpackFactoryOrValue } from '@ns3/ts-utils';
import { DependencyList, useDebugValue, useEffect, useState } from 'react';
import {
  ErrorResult,
  makeErrorResult,
  makeSuccessResult,
  PENDING_RESULT,
  PendingResult,
  SuccessResult,
} from '../utils/results';

export type PromiseResult<T> = PendingResult | SuccessResult<T> | ErrorResult;

export function usePromise<T>(
  factory: FactoryOrValue<Falsy | Promise<T>>,
  deps: DependencyList | undefined,
): PromiseResult<T> {
  const [value, setValue] = useState<PromiseResult<T>>(PENDING_RESULT);

  useEffect(() => {
    let ended = false;
    const expression = async () => {
      try {
        const promise = unpackFactoryOrValue(factory);

        if (!promise) {
          return;
        }

        const value = await promise;

        if (!ended) {
          setValue(makeSuccessResult(value));
        }
      } catch (error: any) {
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

  useDebugValue(value);

  return value;
}
