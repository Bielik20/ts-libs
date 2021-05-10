import { Observable } from 'rxjs';
import { RxValidityMap } from './rx-validity-map';

export class RxMapStore<TKey, TValue> extends RxValidityMap<TKey, TValue> {
  get(key: TKey): Observable<TValue | undefined> {
    return this.ensure(key).value$.asObservable();
  }

  set(key: TKey, value: TValue): void {
    const { value$ } = this.updateExpiresAt(key);

    value$.next(value);
  }
}
