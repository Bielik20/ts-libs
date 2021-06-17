import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Change, makeChange } from '../models/change';
import { RxBase } from './rx-base';

export type RxMapKey<Type> = Type extends RxMap<infer X, unknown> ? X : never;
export type RxMapValue<Type> = Type extends RxMap<unknown, infer X> ? X : never;

export class RxMap<TKey, TValue> extends RxBase<TKey, TValue | undefined> {
  protected readonly change$$ = new Subject<Change<TKey, TValue>>();
  readonly change$ = this.change$$.asObservable();

  constructor() {
    super(() => undefined);
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

  get$(key: TKey): Observable<TValue | undefined> {
    return this.ensure(key).asObservable();
  }

  get(key: TKey): TValue | undefined {
    return this.ensure(key).value;
  }

  set(key: TKey, value: TValue): void {
    this.update([[key, value]]);
  }

  setEntries(entries: ReadonlyArray<[key: TKey, value: TValue]>): void {
    this.update(entries);
  }

  delete(key: TKey): void {
    this.update([[key, undefined]]);
  }

  clear(): void {
    this.update(Array.from(this.map.keys()).map((key) => [key, undefined]));
  }

  protected updateImpl(key: TKey, value: TValue | undefined): boolean {
    const value$ = this.ensure(key);
    const oldValue = value$.value;

    if (value === oldValue) {
      return false;
    }

    value$.next(value);
    this.change$$.next(makeChange(key, oldValue, value));

    return true;
  }
}
