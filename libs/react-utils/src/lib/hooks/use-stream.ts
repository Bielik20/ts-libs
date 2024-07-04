import { FactoryOrValue, Falsy, unpackFactoryOrValue } from '@ns3/ts-utils';
import { DependencyList, useDebugValue, useEffect, useMemo, useState } from 'react';
import { BehaviorSubject, debounce, last, Observable, takeUntil } from 'rxjs';
import {
  ErrorResult,
  makeErrorResult,
  makeSuccessResult,
  PENDING_RESULT,
  PendingResult,
  SuccessResult,
} from '../utils/results';

export type StreamResult<T> = PendingResult | SuccessResult<T> | ErrorResult;

export function useStream<T>(
  factory: FactoryOrValue<Falsy | Observable<T>>,
  deps: DependencyList,
): StreamResult<T> {
  const behaviorSubject$ = useMemo(() => {
    const behaviorSubject$ = new BehaviorSubject<StreamResult<T>>(PENDING_RESULT);
    const stream$ = unpackFactoryOrValue(factory);

    if (stream$) {
      stream$.pipe(takeUntil(behaviorSubject$.pipe(last()))).subscribe({
        next: (v) => behaviorSubject$.next(makeSuccessResult(v)),
        error: (e) => behaviorSubject$.next(makeErrorResult(e)),
      });
    }

    return behaviorSubject$;
  }, deps);

  const [value, setValue] = useState<StreamResult<T>>(behaviorSubject$.value);

  useEffect(() => {
    behaviorSubject$.pipe(debounce(() => Promise.resolve())).subscribe(setValue);

    return () => behaviorSubject$.complete();
  }, [behaviorSubject$]);

  useDebugValue(value);

  return value;
}
