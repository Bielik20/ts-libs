import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Change, makeChange } from '../models/change';

export type RxMapKey<Type> = Type extends RxMap<infer X, unknown> ? X : never;
export type RxMapValue<Type> = Type extends RxMap<unknown, infer X> ? X : never;

export class RxMap<TKey, TValue> {
  protected readonly $$ = new BehaviorSubject<void>(undefined);
  protected readonly map = new Map<TKey, BehaviorSubject<TValue | undefined>>();
  protected readonly change$$ = new Subject<Change<TKey, TValue>>();
  readonly change$ = this.change$$.asObservable();

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

  get$(key: TKey): Observable<TValue | undefined> {
    return this.ensure(key).asObservable();
  }

  get(key: TKey): TValue | undefined {
    return this.ensure(key).value;
  }

  set(key: TKey, value: TValue): void {
    const changed = this.updateValue(key, value);

    if (changed) {
      this.$$.next();
    }
  }

  setEntries(entries: ReadonlyArray<[key: TKey, value: TValue]>): void {
    let changed = false;

    for (const [key, value] of entries) {
      const result = this.updateValue(key, value);

      changed = changed || result;
    }

    if (changed) {
      this.$$.next();
    }
  }

  delete(key: TKey): void {
    const changed = this.updateValue(key, undefined);

    if (changed) {
      this.$$.next();
    }
  }

  clear(): void {
    let changed = false;

    this.map.forEach((value, key) => {
      const result = this.updateValue(key, undefined);

      changed = changed || result;
    });

    if (changed) {
      this.$$.next();
    }
  }

  protected updateValue(key: TKey, value: TValue | undefined): boolean {
    const value$ = this.ensure(key);
    const oldValue = value$.value;

    if (value === oldValue) {
      return false;
    }

    value$.next(value);
    this.change$$.next(makeChange(key, oldValue, value));

    return true;
  }

  protected ensure(key: TKey): BehaviorSubject<TValue | undefined> {
    if (!this.map.has(key)) {
      this.map.set(key, new BehaviorSubject<TValue | undefined>(undefined));
    }

    return this.map.get(key)!;
  }
}
