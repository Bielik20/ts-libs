import { FactoryOrValue, Falsy, unpackFactoryOrValue } from '@ns3/ts-utils';
import { DependencyList, useMemo, useRef } from 'react';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import {
  ErrorResult,
  makeErrorResult,
  makeSuccessResult,
  PENDING_RESULT,
  PendingResult,
  SuccessResult,
} from '../utils/results';
import { useBehaviorSubjectValue } from './use-behavior-subject-value';

export type StreamResult<T> = PendingResult | SuccessResult<T> | ErrorResult;

export function useStream<T>(
  factory: FactoryOrValue<Falsy | Observable<T>>,
  deps?: DependencyList,
): StreamResult<T> {
  const sub = useRef<Subscription>({ unsubscribe: () => null } as Subscription);
  const behaviorSubject$ = useMemo(() => new BehaviorSubject<StreamResult<T>>(PENDING_RESULT), []);

  useMemo(() => {
    const stream$ = unpackFactoryOrValue(factory);

    sub.current.unsubscribe();

    if (!stream$) {
      return behaviorSubject$.next(PENDING_RESULT);
    }

    let immediate = false;

    sub.current = stream$.subscribe({
      next: (v) => {
        immediate = true;
        behaviorSubject$.next(makeSuccessResult(v));
      },
      error: (e) => {
        immediate = true;
        behaviorSubject$.next(makeErrorResult(e));
      },
    });

    !immediate && behaviorSubject$.next(PENDING_RESULT);
  }, deps);

  return useBehaviorSubjectValue(behaviorSubject$);
}
