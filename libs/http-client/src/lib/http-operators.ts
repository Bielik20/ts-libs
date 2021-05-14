import { Observable } from 'rxjs';
import { AjaxResponse } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { RxJsOperator } from './models/rxjs-operator';

export function toResponse<T = unknown>(): RxJsOperator<AjaxResponse, T> {
  return (source: Observable<AjaxResponse>): Observable<T> =>
    source.pipe(map((res) => res.response || {}));
}
