import { FactoryOrValue, Falsy, unpackFactoryOrValue } from '@ns3/ts-utils';
import { DependencyList, useMemo, useRef } from 'react';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { useBehaviorSubjectValue } from './use-behavior-subject-value';

export function useStreamValue<T>(
  factory: FactoryOrValue<Falsy | Observable<T>>,
  deps?: DependencyList,
): T | undefined {
  const sub = useRef<Subscription>({ unsubscribe: () => null } as Subscription);
  const behaviorSubject$ = useMemo(() => new BehaviorSubject<T | undefined>(undefined), []);

  useMemo(() => {
    const stream$ = unpackFactoryOrValue(factory);

    sub.current.unsubscribe();

    if (!stream$) {
      return behaviorSubject$.next(undefined);
    }

    sub.current = stream$.subscribe({
      next: (v) => behaviorSubject$.next(v),
      error: () => behaviorSubject$.next(undefined),
    });
  }, deps);

  return useBehaviorSubjectValue(behaviorSubject$);
}
