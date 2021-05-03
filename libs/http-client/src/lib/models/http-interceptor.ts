import { Observable } from 'rxjs';
import { HttpHandler } from './http-handler';
import { HttpRequest } from './http-request';
import { HttpResponse } from './http-response';

export interface HttpInterceptor {
  intercept(req: HttpRequest, next: HttpHandler): Observable<HttpResponse>;
}
