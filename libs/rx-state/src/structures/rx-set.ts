import { map, Observable } from 'rxjs';
import { RxBase } from './rx-base';

export class RxSet<TKey> extends RxBase<TKey, boolean> {
  protected readonly set = new Set<TKey>();

  constructor() {
    super(() => false);
  }

  size$(): Observable<number> {
    return this.$$.pipe(map(() => this.size()));
  }

  size(): number {
    return this.set.size;
  }

  keys(): TKey[] {
    return Array.from(this.set.keys());
  }

  has$(key: TKey): Observable<boolean> {
    return this.ensure(key).asObservable();
  }

  has(key: TKey): boolean {
    return this.ensure(key).value;
  }

  add(key: TKey): void {
    this.update([[key, true]]);
  }

  delete(key: TKey): void {
    this.update([[key, false]]);
  }

  clear(): void {
    this.update(Array.from(this.map.keys()).map((key) => [key, false]));
  }

  protected updateImpl(key: TKey, value: boolean): boolean {
    const value$ = this.ensure(key);

    if (value === value$.value) {
      return false;
    }

    if (value === true) {
      this.set.add(key);
    } else {
      this.set.delete(key);
    }

    value$.next(value);

    return true;
  }
}
