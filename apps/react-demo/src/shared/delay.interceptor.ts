import { HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@ns3/http-client';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

export class DelayInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest, next: HttpHandler): Observable<HttpResponse> {
    return next(req).pipe(delay(1000));
  }
}
