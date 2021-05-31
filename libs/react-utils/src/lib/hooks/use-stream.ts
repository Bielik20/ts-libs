import { FactoryOrValue, Falsy, unpackFactoryOrValue } from '@ns3/ts-utils';
import { DependencyList, useMemo, useState } from 'react';
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
  const [subscription, setSubscription] = useState<Subscription | undefined>(undefined);
  const behaviorSubject$ = useMemo(() => new BehaviorSubject<StreamResult<T>>(PENDING_RESULT), []);

  useMemo(() => {
    const stream$ = unpackFactoryOrValue(factory);

    subscription && subscription.unsubscribe();

    if (!stream$) {
      return behaviorSubject$.next(PENDING_RESULT);
    }

    let immediate = false;

    setSubscription(
      stream$.subscribe(
        (v) => {
          immediate = true;
          behaviorSubject$.next(makeSuccessResult(v));
        },
        (e) => {
          immediate = true;
          behaviorSubject$.next(makeErrorResult(e));
        },
      ),
    );
    !immediate && behaviorSubject$.next(PENDING_RESULT);
  }, deps);

  return useBehaviorSubjectValue(behaviorSubject$);
}
