import { Observable } from 'rxjs';
import { RxValidityMap } from './rx-validity-map';

export class RxEntityStore<TKey, TValue> extends RxValidityMap<TKey, TValue> {
  get(key: TKey): Observable<TValue | undefined> {
    return this.ensure(key).value$.asObservable();
  }

  set(key: TKey, value: TValue): void {
    this.updateExpiresAt(key);
    this.updateValue(key, value);
  }
}
