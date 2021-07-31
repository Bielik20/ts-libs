import { of, Subject, throwError } from 'rxjs';
import { ObservablesCache } from './observables-cache';

describe('ObservablesCache', () => {
  let cache: ObservablesCache<string, number>;

  beforeEach(() => {
    cache = new ObservablesCache<string, number>();
  });

  it('should return value from cache', () => {
    const nextSpy = jest.fn();
    const errorSpy = jest.fn();
    const factorySubject$ = new Subject<number>();
    const factoryMock = jest.fn(() => factorySubject$.asObservable());

    cache.ensure$('a', factoryMock).subscribe({ next: nextSpy, error: errorSpy });
    cache.ensure$('a', factoryMock).subscribe({ next: nextSpy, error: errorSpy });
    expect(factoryMock).toHaveBeenCalledTimes(1);

    factorySubject$.next(10);
    expect(nextSpy).toHaveBeenCalledTimes(2);
    expect(errorSpy).toHaveBeenCalledTimes(0);

    factorySubject$.error(new Error());
    expect(nextSpy).toHaveBeenCalledTimes(2);
    expect(errorSpy).toHaveBeenCalledTimes(2);
  });

  it('should remove after completed', () => {
    const nextSpy = jest.fn();
    const errorSpy = jest.fn();
    const completingFactoryMock = jest.fn(() => of(10));

    cache.ensure$('a', completingFactoryMock).subscribe({ next: nextSpy, error: errorSpy });
    cache.ensure$('a', completingFactoryMock).subscribe({ next: nextSpy, error: errorSpy });
    expect(completingFactoryMock).toHaveBeenCalledTimes(2);
    expect(cache.has('a')).toBe(false);
  });

  it('should remove cache after throw', () => {
    const nextSpy = jest.fn();
    const errorSpy = jest.fn();
    const throwingFactoryMock = jest.fn(() => throwError(() => new Error()));

    cache.ensure$('a', throwingFactoryMock).subscribe({ next: nextSpy, error: errorSpy });
    cache.ensure$('a', throwingFactoryMock).subscribe({ next: nextSpy, error: errorSpy });
    expect(throwingFactoryMock).toHaveBeenCalledTimes(2);
    expect(cache.has('a')).toBe(false);
  });

  it('should keep cache while there is at least one subscriber', () => {
    const firstSubject$ = new Subject<number>();
    const firstFactory = jest.fn(() => firstSubject$.asObservable());
    const secondSubject$ = new Subject<number>();
    const secondFactory = jest.fn(() => secondSubject$.asObservable());

    const firstSub = cache.ensure$('a', firstFactory).subscribe();
    const secondSub = cache.ensure$('a', secondFactory).subscribe();

    firstSub.unsubscribe();
    expect(cache.has('a')).toBe(true);

    secondSub.unsubscribe();
    expect(cache.has('a')).toBe(false);
  });
});
