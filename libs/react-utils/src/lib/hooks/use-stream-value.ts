import { FactoryOrValue, Falsy, unpackFactoryOrValue } from '@ns3/ts-utils';
import { DependencyList, useEffect, useMemo, useRef } from 'react';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { useBehaviorSubjectValue } from './use-behavior-subject-value';

export function useStreamValue<T>(
  factory: FactoryOrValue<Falsy | Observable<T>>,
  deps?: DependencyList,
): T | undefined {
  const sub = useRef<Pick<Subscription, 'unsubscribe'>>({ unsubscribe: () => null });

  const behaviorSubject$ = useMemo(() => {
    const behaviorSubject$ = new BehaviorSubject<T | undefined>(undefined);
    const stream$ = unpackFactoryOrValue(factory);

    sub.current.unsubscribe();

    if (stream$) {
      sub.current = stream$.subscribe({
        next: (v) => behaviorSubject$.next(v),
        error: () => behaviorSubject$.next(undefined),
      });
    }

    return behaviorSubject$;
  }, deps);

  useEffect(() => {
    return () => sub.current.unsubscribe();
  }, []);

  return useBehaviorSubjectValue(behaviorSubject$);
}
