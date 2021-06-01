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
  const sub = useRef<Pick<Subscription, 'unsubscribe'>>({ unsubscribe: () => null });

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

  return useBehaviorSubjectValue(behaviorSubject$);
}
