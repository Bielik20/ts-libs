import { Container, Inject, Injectable } from '@wikia/dependency-injection';
import { Observable, of } from 'rxjs';
import { ajax, AjaxConfig, AjaxResponse } from 'rxjs/ajax';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from './http-client';
import { HttpInterceptors } from './http-interceptors';
import { HttpHandler } from './models/http-handler';
import { HttpInterceptor } from './models/http-interceptor';

const SPY = Symbol('spy');

@Injectable()
class FirstInterceptor implements HttpInterceptor {
  constructor(@Inject(SPY) private spy: jest.Mock) {}

  intercept<T>(req: AjaxConfig, next: HttpHandler<T>): Observable<AjaxResponse<T>> {
    this.spy('first req', req);

    return next({
      ...req,
      headers: { ...req.headers, common: 'first', first: 'foo' },
    }).pipe(
      map((res) => ({ ...res, common: 'first', first: 'foo' })),
      tap((res) => this.spy('first res', res)),
    );
  }
}

@Injectable()
class SecondInterceptor implements HttpInterceptor {
  constructor(@Inject(SPY) private spy: jest.Mock) {}

  intercept<T>(req: AjaxConfig, next: HttpHandler<T>): Observable<AjaxResponse<T>> {
    this.spy('second req', req);

    return next({
      ...req,
      headers: { ...req.headers, common: 'second', second: 'bar' },
    }).pipe(
      map((res) => ({ ...res, common: 'second', second: 'bar' })),
      tap((res) => this.spy('second res', res)),
    );
  }
}

@Injectable()
class InterceptorWithHttpClient implements HttpInterceptor {
  constructor(@Inject(SPY) private spy: jest.Mock, private client: HttpClient) {}

  intercept<T>(req: AjaxConfig, next: HttpHandler<T>): Observable<AjaxResponse<T>> {
    this.spy(this.client);

    return next(req).pipe(map((res) => ({ ...res, withClient: 'works' })));
  }
}

jest.mock('rxjs/ajax');

describe('HttpInterceptors', () => {
  let httpClient: HttpClient;
  let spy: jest.Mock;
  const ajaxMock: jest.Mock = ajax as any;

  beforeEach(() => {
    spy = jest.fn();
    ajaxMock.mockImplementation((req) => {
      spy('ajax req', req);

      return of({ ajax: 'ajax' });
    });
  });

  describe('regular', () => {
    beforeEach(() => {
      const container = new Container();

      container.bind(SPY).value(spy);
      container.bind(HttpInterceptors.provide(FirstInterceptor, SecondInterceptor));
      httpClient = container.get(HttpClient);
    });

    it('should call interceptors in the right order', (done) => {
      httpClient.get('/api').subscribe(() => {
        expect(spy.mock.calls.map((arr) => arr[0])).toEqual([
          'first req',
          'second req',
          'ajax req',
          'second res',
          'first res',
        ]);
        done();
      });
    });

    it('should modify req and res', (done) => {
      httpClient.get('/api').subscribe((res) => {
        const [, req] = spy.mock.calls.find((arr) => arr[0] === 'ajax req');

        expect(req).toEqual({
          method: 'GET',
          url: '/api',
          headers: {
            'Content-Type': 'application/json',
            common: 'second',
            first: 'foo',
            second: 'bar',
          },
        });
        expect(res).toEqual({
          ajax: 'ajax',
          common: 'first',
          first: 'foo',
          second: 'bar',
        });

        done();
      });
    });
  });

  it('should be able to inject http client', (done) => {
    const container = new Container();

    container.bind(SPY).value(spy);
    container.bind(HttpInterceptors.provide(InterceptorWithHttpClient));
    httpClient = container.get(HttpClient);

    httpClient.get('/api').subscribe((res) => {
      const [client] = spy.mock.calls[0];

      expect(client).toBeInstanceOf(HttpClient);
      expect(res).toEqual({
        ajax: 'ajax',
        withClient: 'works',
      });

      done();
    });
  });
});
