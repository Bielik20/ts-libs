import { BehaviorSubject, map, Observable } from 'rxjs';
import { Debuggable, DEBUGGABLE_KEY } from '../models/debuggable';
import { mapEntriesToRecord } from '../utils/map-entries-to-record';

export abstract class RxBase<TKey, TValue> implements Debuggable {
  protected readonly $$ = new BehaviorSubject<void>(undefined);
  protected readonly map = new Map<TKey, BehaviorSubject<TValue>>();

  protected constructor(private factory: (key: TKey) => TValue) {}

  protected ensure(key: TKey): BehaviorSubject<TValue> {
    if (!this.map.has(key)) {
      this.map.set(key, new BehaviorSubject(this.factory(key)));
    }

    return this.map.get(key)!;
  }

  [DEBUGGABLE_KEY]() {
    return this.entries$().pipe(map(mapEntriesToRecord));
  }

  keys$(): Observable<TKey[]> {
    return this.$$.pipe(map(() => this.keys()));
  }

  keys(): TKey[] {
    return Array.from(this.map.keys()).filter((key) => this.ensure(key).value !== undefined);
  }

  values$(): Observable<TValue[]> {
    return this.$$.pipe(map(() => this.values()));
  }

  values(): TValue[] {
    return this.keys().map((key) => this.ensure(key).value!);
  }

  entries$(): Observable<[key: TKey, value: TValue][]> {
    return this.$$.pipe(map(() => this.entries()));
  }

  entries(): [key: TKey, value: TValue][] {
    return this.keys().map((key) => [key, this.ensure(key).value!]);
  }

  protected update(entries: ReadonlyArray<[key: TKey, value: TValue]>): boolean {
    let changed = false;

    for (const [key, value] of entries) {
      const result = this.updateImpl(key, value);

      changed = changed || result;
    }

    if (changed) {
      this.$$.next();
    }

    return changed;
  }

  protected abstract updateImpl(key: TKey, value: TValue): boolean;
}
