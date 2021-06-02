import { FactoryOrValue, Falsy, unpackFactoryOrValue } from '@ns3/ts-utils';
import { DependencyList, useEffect, useMemo, useRef, useState } from 'react';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { debounce } from 'rxjs/operators';

type Options<TSource, TOutput> = {
  initial: TOutput;
  next: (v: TSource) => TOutput;
  error: (e: any) => TOutput;
};

export function useStreamInternal<TSource, TOutput>(
  options: Options<TSource, TOutput>,
  factory: FactoryOrValue<Falsy | Observable<TSource>>,
  deps?: DependencyList,
): TOutput {
  const sub = useRef<Pick<Subscription, 'unsubscribe'>>({ unsubscribe: () => null });

  const behaviorSubject$ = useMemo(() => {
    const behaviorSubject$ = new BehaviorSubject<TOutput>(options.initial);
    const stream$ = unpackFactoryOrValue(factory);

    sub.current.unsubscribe();

    if (stream$) {
      sub.current = stream$.subscribe({
        next: (v) => behaviorSubject$.next(options.next(v)),
        error: (e) => behaviorSubject$.next(options.error(e)),
      });
    }

    return behaviorSubject$;
  }, deps);

  const [value, setValue] = useState<TOutput>(behaviorSubject$.value);

  useEffect(() => {
    behaviorSubject$.pipe(debounce(() => Promise.resolve())).subscribe(setValue);

    return () => behaviorSubject$.complete();
  }, [behaviorSubject$]);

  useEffect(() => {
    return () => sub.current.unsubscribe();
  }, []);

  return value;
}
