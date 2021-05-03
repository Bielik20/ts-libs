import { Injectable } from '@wikia/dependency-injection';
import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { concatMap } from 'rxjs/operators';
import { HttpInterceptors } from './http-interceptors';
import { HttpHandler } from './models/http-handler';
import { HttpRequest } from './models/http-request';
import { HttpResponse } from './models/http-response';

type Response<R> = Observable<HttpResponse<R>>;

const BackendHandler: HttpHandler = (req) => {
  return ajax(req);
};

@Injectable()
export class HttpClient {
  private _handler: HttpHandler;

  constructor(private interceptors: HttpInterceptors) {}

  get<T = unknown>(url: string, headers?: Record<string, any>): Response<T> {
    return this.makeRequest({ method: 'GET', url, headers });
  }

  patch<T = unknown>(url: string, body?: unknown, headers?: Record<string, any>): Response<T> {
    return this.makeRequest({ method: 'PATCH', url, headers, body });
  }

  post<T = unknown>(url: string, body?: unknown, headers?: Record<string, any>): Response<T> {
    return this.makeRequest({ method: 'POST', url, headers, body });
  }

  put<T = unknown>(url: string, body?: unknown, headers?: Record<string, any>): Response<T> {
    return this.makeRequest({ method: 'PUT', url, headers, body });
  }

  delete<T = unknown>(url: string, headers?: Record<string, any>): Response<T> {
    return this.makeRequest({ method: 'DELETE', url, headers });
  }

  private makeRequest(req: HttpRequest): Observable<HttpResponse> {
    const request = this.createRequest(req);
    const handler = this.getHandler();

    return of(request).pipe(concatMap((req) => handler(req)));
  }

  private createRequest(req: HttpRequest): HttpRequest {
    return {
      ...req,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers || {}),
      },
    };
  }

  private getHandler(): HttpHandler {
    if (!this._handler) {
      this._handler = this.createHandler();
    }

    return this._handler;
  }

  private createHandler(): HttpHandler {
    const interceptors = this.interceptors.get();

    return interceptors.reduceRight<HttpHandler>(
      (next, interceptor) => (req: HttpRequest) => interceptor.intercept(req, next),
      BackendHandler,
    );
  }
}
