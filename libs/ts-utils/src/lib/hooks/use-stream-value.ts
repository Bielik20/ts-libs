import { DependencyList, useMemo, useState } from 'react';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { useBehaviorSubjectValue } from './use-behavior-subject-value';

export function useStreamValue<T>(
  factory: () => Observable<T>,
  deps?: DependencyList,
): T | undefined {
  const [subscription, setSubscription] = useState<Subscription | undefined>(undefined);
  const behaviorSubject$ = useMemo(() => new BehaviorSubject<T | undefined>(undefined), []);

  useMemo(() => {
    const stream$ = factory();

    subscription && subscription.unsubscribe();

    if (!stream$) {
      return undefined;
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
