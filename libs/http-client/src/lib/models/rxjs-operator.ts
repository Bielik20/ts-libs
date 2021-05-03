import { Observable } from 'rxjs';

export type RxJsOperator<T, R> = (source: Observable<T>) => Observable<R>;
