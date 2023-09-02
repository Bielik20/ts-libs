import { Observable, Subject } from 'rxjs';
import { Change, makeChange } from '../models/change';
import { Debuggable } from '../models/debuggable';
import { RxBase } from './rx-base';

export type RxMapKey<Type> = Type extends RxMap<infer X, any> ? X : never;
export type RxMapValue<Type> = Type extends RxMap<any, infer X> ? X : never;

export class RxMap<TKey, TValue> extends RxBase<TKey, TValue | undefined> implements Debuggable {
  protected readonly change$$ = new Subject<Change<TKey, TValue>>();
  readonly change$ = this.change$$.asObservable();

  constructor() {
    super(() => undefined);
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
