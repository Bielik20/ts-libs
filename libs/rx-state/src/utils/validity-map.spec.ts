import { of, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { RxMap } from '../structures/rx-map';
import { ValidityMap } from './validity-map';

interface HooksMock {
  set: jest.Mock;
  has: jest.Mock;
  get$: jest.Mock;
  connecting: jest.Mock;
  connected: jest.Mock;
}

describe('ValidityMap', () => {
  const timeout = 1000;
  const moreThanTimeout = timeout + 1;
  const oldValue = 50;
  const newValue = 100;
  let dateNowMock: jest.Mock;
  let mockRxMap: RxMap<string, number>;
  let factorySubject$: Subject<number>;
  let factoryMock: jest.Mock;
  let hooks: HooksMock;
  let validityMap: ValidityMap<string, number>;

  beforeEach(() => {
    dateNowMock = jest.fn().mockReturnValue(0);
    Date.now = dateNowMock;
    mockRxMap = new RxMap<string, number>();
    factorySubject$ = new Subject<number>();
    factoryMock = jest.fn(() => factorySubject$.asObservable());
    hooks = {
      get$: jest.fn((k) => mockRxMap.get$(k)),
      has: jest.fn((k) => mockRxMap.get(k) !== undefined),
      set: jest.fn((k, v) => {
        validityMap.validate(k);
        mockRxMap.set(k, v);
      }),
      connecting: jest.fn(),
      connected: jest.fn(),
    };
  });

  describe('connect', () => {
    describe('strategy: eager', () => {
      beforeEach(() => {
        makeValidityMap('eager', 'single');
      });

      shouldConnectEagerlyFirstCall();
      shouldNotConnectIfValid();
      shouldEmitMultipleFromConnect();
      shouldEmitMultipleFromGetHook();
      shouldBeAbleToThrowError();
      shouldSetConnectingAfterSubscribe();
      shouldManuallyValidate();

      it('should manually invalidate', () => {
        const results = invalidate();
        expect(results).toEqual([oldValue, newValue]);
      });

      it('should manually invalidate all', () => {
        const { aResults, bResults } = invalidateAll();

        expect(aResults).toEqual([oldValue, newValue]);
        expect(bResults).toEqual([oldValue, newValue]);
      });

      it('should connect if invalid and receive only new value', () => {
        const results = connectAfterInvalid();

        expect(results).toEqual([newValue]);
        expect(factoryMock).toHaveBeenCalled();
      });
    });

    describe('strategy: lazy', () => {
      beforeEach(() => {
        makeValidityMap('lazy', 'single');
      });

      shouldConnectEagerlyFirstCall();
      shouldNotConnectIfValid();
      shouldEmitMultipleFromConnect();
      shouldEmitMultipleFromGetHook();
      shouldBeAbleToThrowError();
      shouldSetConnectingAfterSubscribe();
      shouldManuallyValidate();

      it('should manually invalidate', () => {
        const results = invalidate();
        expect(results).toEqual([oldValue, oldValue, newValue]);
      });

      it('should manually invalidate all', () => {
        const { aResults, bResults } = invalidateAll();

        expect(aResults).toEqual([oldValue, oldValue, newValue]);
        expect(bResults).toEqual([oldValue, oldValue, newValue]);
      });

      it('should connect if invalid and receive old and new value', () => {
        const results = connectAfterInvalid();

        expect(results).toEqual([oldValue, newValue]);
        expect(factoryMock).toHaveBeenCalled();
      });
    });

    describe('scope: single', () => {
      beforeEach(() => {
        makeValidityMap('eager', 'single');
      });

      it('should invalidate single value', () => {
        const { firstResults, secondResults } = connectFirstAndSecondAfterFirstInvalid();

        expect(firstResults).toEqual([newValue]);
        expect(secondResults).toEqual([oldValue]);
      });
    });

    describe('scope: all', () => {
      beforeEach(() => {
        makeValidityMap('eager', 'all');
      });

      it('should invalidate all values', () => {
        const { firstResults, secondResults } = connectFirstAndSecondAfterFirstInvalid();

        expect(firstResults).toEqual([newValue]);
        expect(secondResults).toEqual([newValue]);
      });
    });
  });

  function shouldNotConnectIfValid() {
    it('should not connect if valid', () => {
      const results: number[] = [];

      validityMap.connect$('a', () => of(oldValue)).subscribe();
      hooks.connecting.mockClear();
      hooks.connected.mockClear();
      validityMap.connect$('a', factoryMock).subscribe((v) => results.push(v));
      factorySubject$.next(newValue);

      expect(results).toEqual([oldValue]);
      expect(factoryMock).not.toHaveBeenCalled();
      expect(hooks.connecting).not.toHaveBeenCalled();
      expect(hooks.connected).not.toHaveBeenCalled();
    });
  }

  function shouldConnectEagerlyFirstCall() {
    it('should connect eagerly first call', () => {
      const results: number[] = [];

      validityMap.connect$('a', factoryMock).subscribe((v) => results.push(v));
      factorySubject$.next(newValue);

      expect(results).toEqual([newValue]);
      expect(factoryMock).toHaveBeenCalled();
      expect(hooks.connecting).toHaveBeenCalledWith('a');
      expect(hooks.connected).toHaveBeenCalledWith('a');
      expect(hooks.connecting.mock.invocationCallOrder[0]).toBeLessThan(
        hooks.connected.mock.invocationCallOrder[0],
      );
    });
  }

  function shouldEmitMultipleFromConnect() {
    it('should emit multiple from connect', () => {
      const results: number[] = [];

      validityMap.connect$('a', factoryMock).subscribe((v) => results.push(v));
      factorySubject$.next(oldValue);
      factorySubject$.next(newValue);
      factorySubject$.next(oldValue);

      expect(results).toEqual([oldValue, newValue, oldValue]);
      expect(hooks.connecting).toHaveBeenCalledWith('a');
      expect(hooks.connecting).toHaveBeenCalledTimes(1);
      expect(hooks.connected).toHaveBeenCalledWith('a');
      expect(hooks.connected).toHaveBeenCalledTimes(3);
    });
  }

  function shouldEmitMultipleFromGetHook() {
    it('should emit multiple from get hook', () => {
      const results: number[] = [];

      validityMap.connect$('a', () => of(oldValue)).subscribe((v) => results.push(v));
      mockRxMap.set('a', newValue);
      mockRxMap.set('a', oldValue);
      mockRxMap.set('a', newValue);

      expect(results).toEqual([oldValue, newValue, oldValue, newValue]);
    });
  }

  function shouldBeAbleToThrowError() {
    it('should be able to throw error', () => {
      const results: number[] = [];
      const errors: Error[] = [];
      const error = new Error('Test Error');

      validityMap.connect$('a', factoryMock).subscribe(
        (v) => results.push(v),
        (error) => errors.push(error),
      );
      factorySubject$.next(oldValue);
      factorySubject$.error(error);
      mockRxMap.set('a', newValue);

      expect(results).toEqual([oldValue]);
      expect(errors).toEqual([error]);
      expect(hooks.connecting).toHaveBeenCalledWith('a');
      expect(hooks.connecting).toHaveBeenCalledTimes(1);
      expect(hooks.connected).toHaveBeenCalledWith('a');
      expect(hooks.connected).toHaveBeenCalledTimes(2);
    });
  }

  function shouldSetConnectingAfterSubscribe() {
    it('should set connecting after subscribe', () => {
      const stream$ = validityMap.connect$('a', factoryMock);

      expect(hooks.connecting).not.toHaveBeenCalled();

      stream$.subscribe();

      expect(hooks.connecting).toHaveBeenCalled();
    });
  }

  function shouldManuallyValidate() {
    it('should manually validate', () => {
      const results: number[] = [];

      mockRxMap.set('a', newValue);
      validityMap.validate('a');
      validityMap.connect$('a', factoryMock).subscribe((v) => results.push(v));
      factorySubject$.next(oldValue);

      expect(results).toEqual([newValue]);
      expect(factoryMock).not.toHaveBeenCalled();
    });
  }

  function invalidate(): number[] {
    const results: number[] = [];

    validityMap
      .connect$('a', factoryMock)
      .pipe(take(1))
      .subscribe((v) => results.push(v));
    factorySubject$.next(oldValue);
    validityMap.invalidate('a');
    validityMap.connect$('a', factoryMock).subscribe((v) => results.push(v));
    factorySubject$.next(newValue);

    expect(factoryMock).toHaveBeenCalledTimes(2);

    return results;
  }

  function invalidateAll(): { aResults: number[]; bResults: number[] } {
    const aResults: number[] = [];
    const bResults: number[] = [];

    validityMap
      .connect$('a', () => of(oldValue))
      .pipe(take(1))
      .subscribe((v) => aResults.push(v));
    validityMap
      .connect$('b', () => of(oldValue))
      .pipe(take(1))
      .subscribe((v) => bResults.push(v));
    validityMap.invalidateAll();
    validityMap.connect$('a', factoryMock).subscribe((v) => aResults.push(v));
    validityMap.connect$('b', factoryMock).subscribe((v) => bResults.push(v));
    factorySubject$.next(newValue);

    expect(factoryMock).toHaveBeenCalledTimes(2);

    return { aResults, bResults };
  }

  function connectAfterInvalid(): number[] {
    const results: number[] = [];

    validityMap.connect$('a', () => of(oldValue)).subscribe();
    hooks.connecting.mockClear();
    hooks.connected.mockClear();
    advanceTime(moreThanTimeout);
    validityMap.connect$('a', factoryMock).subscribe((v) => results.push(v));
    factorySubject$.next(newValue);

    expect(hooks.connecting).toHaveBeenCalledWith('a');
    expect(hooks.connected).toHaveBeenCalledWith('a');
    expect(hooks.connecting.mock.invocationCallOrder[0]).toBeLessThan(
      hooks.connected.mock.invocationCallOrder[0],
    );

    return results;
  }

  function connectFirstAndSecondAfterFirstInvalid(): {
    firstResults: number[];
    secondResults: number[];
  } {
    const firstResults: number[] = [];
    const secondResults: number[] = [];

    validityMap.connect$('a', () => of(oldValue)).subscribe();
    advanceTime(moreThanTimeout);
    validityMap.connect$('b', () => of(oldValue)).subscribe();
    validityMap.connect$('a', factoryMock).subscribe((v) => firstResults.push(v));
    validityMap.connect$('b', factoryMock).subscribe((v) => secondResults.push(v));
    factorySubject$.next(newValue);

    return { firstResults, secondResults };
  }

  function advanceTime(time: number): void {
    dateNowMock.mockReturnValue(dateNowMock() + time);
  }

  function makeValidityMap(strategy: 'eager' | 'lazy', scope: 'single' | 'all'): void {
    validityMap = new ValidityMap<string, number>({ timeout, scope, strategy }, hooks);
  }
});