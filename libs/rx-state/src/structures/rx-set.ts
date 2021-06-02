import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class RxSet<TKey> {
  protected readonly set = new Set<TKey>();
  protected readonly set$ = new BehaviorSubject<void>(undefined);
  protected readonly map = new Map<TKey, BehaviorSubject<boolean>>();

  size$(): Observable<number> {
    return this.set$.pipe(map(() => this.size()));
  }

  size(): number {
    return this.set.size;
  }

  keys$(): Observable<TKey[]> {
    return this.set$.pipe(map(() => this.keys()));
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

    Array.from(this.set.keys()).map((key) => {
      const result = this.updateValue(key, false);

      changed = changed || result;
    });

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
      this.map.set(key, new BehaviorSubject<boolean>(false));
    }

    return this.map.get(key)!;
  }
}
