import { FactoryOrValue, Falsy, unpackFactoryOrValue } from '@ns3/ts-utils';
import { DependencyList, useDebugValue, useEffect, useMemo, useRef, useState } from 'react';
import { BehaviorSubject, Observable, Unsubscribable } from 'rxjs';
import { debounce } from 'rxjs/operators';
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
  deps?: DependencyList,
): StreamResult<T> {
  const sub = useRef<Unsubscribable>({ unsubscribe: () => null });

  const behaviorSubject$ = useMemo(() => {
    const behaviorSubject$ = new BehaviorSubject<StreamResult<T>>(PENDING_RESULT);
    const stream$ = unpackFactoryOrValue(factory);

    sub.current.unsubscribe();

    if (stream$) {
      sub.current = stream$.subscribe({
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

  useEffect(() => {
    return () => sub.current.unsubscribe();
  }, []);

  useDebugValue(value);

  return value;
}
