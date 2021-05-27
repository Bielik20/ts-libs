import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class RxSet<TKey> {
  protected set = new Set<TKey>();
  protected set$ = new BehaviorSubject<void>(undefined);
  protected map = new Map<TKey, BehaviorSubject<boolean>>();

  get size$(): Observable<number> {
    return this.set$.pipe(map(() => this.size));
  }

  get size(): number {
    return this.set.size;
  }

  keys$(): Observable<TKey[]> {
    return this.set$.pipe(map(() => this.keys()));
  }

  keys(): TKey[] {
    return Array.from(this.set.keys());
  }

  has$(key: TKey): Observable<boolean> {
    return this.ensure(key);
  }

  has(key: TKey): boolean {
    return this.ensure(key).value;
  }

  add(key: TKey): void {
    const changed = this.updateValue(key, true);

    if (changed) {
      this.set$.next();
    }
  }

  delete(key: TKey): void {
    const changed = this.updateValue(key, false);

    if (changed) {
      this.set$.next();
    }
  }

  clear(): void {
    let changed = false;

    for (const key of this.set.keys()) {
      const result = this.updateValue(key, false);

      changed = changed || result;
    }

    if (changed) {
      this.set$.next();
    }
  }

  protected updateValue(key: TKey, value: boolean): boolean {
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

  protected ensure(key: TKey): BehaviorSubject<boolean> {
    if (!this.map.has(key)) {
      this.map.set(key, new BehaviorSubject(false));
    }

    return this.map.get(key);
  }
}
