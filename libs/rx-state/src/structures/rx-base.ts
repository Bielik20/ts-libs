import { BehaviorSubject } from 'rxjs';

export abstract class RxBase<TKey, TValue> {
  protected readonly $$ = new BehaviorSubject<void>(undefined);
  protected readonly map = new Map<TKey, BehaviorSubject<TValue>>();

  protected constructor(private factory: (key: TKey) => TValue) {}

  protected ensure(key: TKey): BehaviorSubject<TValue> {
    if (!this.map.has(key)) {
      this.map.set(key, new BehaviorSubject(this.factory(key)));
    }

    return this.map.get(key)!;
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
