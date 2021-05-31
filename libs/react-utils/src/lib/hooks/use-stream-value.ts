import { FactoryOrValue, Falsy, unpackFactoryOrValue } from '@ns3/ts-utils';
import { DependencyList, useMemo, useState } from 'react';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { useBehaviorSubjectValue } from './use-behavior-subject-value';

export function useStreamValue<T>(
  factory: FactoryOrValue<Falsy | Observable<T>>,
  deps?: DependencyList,
): T | undefined {
  const [subscription, setSubscription] = useState<Subscription | undefined>(undefined);
  const behaviorSubject$ = useMemo(() => new BehaviorSubject<T | undefined>(undefined), []);

  useMemo(() => {
    const stream$ = unpackFactoryOrValue(factory);

    subscription && subscription.unsubscribe();

    if (!stream$) {
      return behaviorSubject$.next(undefined);
    }

    setSubscription(
      stream$.subscribe(
        (v) => behaviorSubject$.next(v),
        () => behaviorSubject$.next(undefined),
      ),
    );
  }, deps);

  return useBehaviorSubjectValue(behaviorSubject$);
}
