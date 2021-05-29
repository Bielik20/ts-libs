import { DependencyList, useMemo } from 'react';
import { combineLatest } from 'rxjs';
import { ObservableInput, ObservedValueOf } from 'rxjs/src/internal/types';
import { FactoryOrValue, unpackFactoryOrValue } from '../utils/factory-or-value';
import { Falsy } from '../utils/falsy';
import { useStreamValue } from './use-stream-value';

export function useCombineLatestValue<O1 extends ObservableInput<any>>(
  factory: FactoryOrValue<Falsy | [O1]>,
  deps?: DependencyList,
): [ObservedValueOf<O1>] | [];
export function useCombineLatestValue<
  O1 extends ObservableInput<any>,
  O2 extends ObservableInput<any>
>(
  factory: FactoryOrValue<Falsy | [O1, O2]>,
  deps?: DependencyList,
): [ObservedValueOf<O1>, ObservedValueOf<O2>] | [];
export function useCombineLatestValue<
  O1 extends ObservableInput<any>,
  O2 extends ObservableInput<any>,
  O3 extends ObservableInput<any>
>(
  factory: FactoryOrValue<Falsy | [O1, O2, O3]>,
  deps?: DependencyList,
): [ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>] | [];
export function useCombineLatestValue<
  O1 extends ObservableInput<any>,
  O2 extends ObservableInput<any>,
  O3 extends ObservableInput<any>,
  O4 extends ObservableInput<any>
>(
  factory: FactoryOrValue<Falsy | [O1, O2, O3, O4]>,
  deps?: DependencyList,
): [ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>, ObservedValueOf<O4>] | [];
export function useCombineLatestValue<
  O1 extends ObservableInput<any>,
  O2 extends ObservableInput<any>,
  O3 extends ObservableInput<any>,
  O4 extends ObservableInput<any>,
  O5 extends ObservableInput<any>
>(
  factory: FactoryOrValue<Falsy | [O1, O2, O3, O4, O5]>,
  deps?: DependencyList,
):
  | [
      ObservedValueOf<O1>,
      ObservedValueOf<O2>,
      ObservedValueOf<O3>,
      ObservedValueOf<O4>,
      ObservedValueOf<O5>,
    ]
  | [];
export function useCombineLatestValue<
  O1 extends ObservableInput<any>,
  O2 extends ObservableInput<any>,
  O3 extends ObservableInput<any>,
  O4 extends ObservableInput<any>,
  O5 extends ObservableInput<any>,
  O6 extends ObservableInput<any>
>(
  factory: FactoryOrValue<Falsy | [O1, O2, O3, O4, O5, O6]>,
  deps?: DependencyList,
):
  | [
      ObservedValueOf<O1>,
      ObservedValueOf<O2>,
      ObservedValueOf<O3>,
      ObservedValueOf<O4>,
      ObservedValueOf<O5>,
      ObservedValueOf<O6>,
    ]
  | [];

export function useCombineLatestValue<O extends ObservableInput<any>>(
  factory: FactoryOrValue<Falsy | O[]>,
  deps?: DependencyList,
): ObservedValueOf<O>[] | [] {
  const value = useMemo(() => {
    const stream$ = unpackFactoryOrValue(factory);

    if (!stream$) {
      return undefined;
    }

    return combineLatest(stream$);
  }, deps);

  return useStreamValue(value, deps) || [];
}
