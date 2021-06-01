import { Observable } from 'rxjs';
import { AjaxConfig, AjaxResponse } from 'rxjs/ajax';
import { HttpHandler } from './http-handler';

export interface HttpInterceptor {
  intercept<T>(req: AjaxConfig, next: HttpHandler<T>): Observable<AjaxResponse<T>>;
}
