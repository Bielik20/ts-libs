import { FactoryOrValue, Falsy } from '@ns3/ts-utils';
import { DependencyList, useDebugValue } from 'react';
import { Observable } from 'rxjs';
import {
  ErrorResult,
  makeErrorResult,
  makeSuccessResult,
  PENDING_RESULT,
  PendingResult,
  SuccessResult,
} from '../utils/results';
import { useStreamInternal } from './use-stream-internal';

export type StreamResult<T> = PendingResult | SuccessResult<T> | ErrorResult;

export function useStream<T>(
  factory: FactoryOrValue<Falsy | Observable<T>>,
  deps?: DependencyList,
): StreamResult<T> {
  const value = useStreamInternal<T, StreamResult<T>>(
    {
      initial: PENDING_RESULT,
      next: (v) => makeSuccessResult(v),
      error: (e) => makeErrorResult(e),
    },
    factory,
    deps,
  );

  useDebugValue(value);

  return value;
}
