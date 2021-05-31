import { of, Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { RxMap } from '../structures/rx-map';
import { ConnectionsManager } from './connections-manager';

interface HooksMock {
  set: jest.Mock;
  has: jest.Mock;
  get$: jest.Mock;
  connecting: jest.Mock;
  connected: jest.Mock;
}

describe('ConnectionsManager', () => {
  const timeout = 1000;
  const moreThanTimeout = timeout + 1;
  const oldValue = 50;
  const newValue = 100;
  let dateNowMock: jest.Mock;
  let mockRxMap: RxMap<string, number>;
  let factorySubject$: Subject<number>;
  let factoryMock: jest.Mock;
  let hooks: HooksMock;
  let connectionsManager: ConnectionsManager<string, number>;

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
        connectionsManager.validate(k);
        mockRxMap.set(k, v);
      }),
      connecting: jest.fn(),
      connected: jest.fn(),
    };
  });

  describe('connect', () => {
    describe('strategy: eager', () => {
      beforeEach(() => {
        makeConnectionsManager('eager', 'single');
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

        expect(aResults).toEqual([oldValue, newValue, newValue]);
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
        makeConnectionsManager('lazy', 'single');
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

        expect(aResults).toEqual([oldValue, oldValue, newValue, newValue]);
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
        makeConnectionsManager('eager', 'single');
      });

      it('should invalidate single value', () => {
        const { firstResults, secondResults } = connectFirstAndSecondAfterFirstInvalid();

        expect(firstResults).toEqual([newValue]);
        expect(secondResults).toEqual([oldValue]);
      });
    });

    describe('scope: all', () => {
      beforeEach(() => {
        makeConnectionsManager('eager', 'all');
      });

      it('should invalidate all values', () => {
        const { firstResults, secondResults } = connectFirstAndSecondAfterFirstInvalid();

        expect(firstResults).toEqual([newValue]);
        expect(secondResults).toEqual([newValue]);
      });

      it('should manually invalidate all', () => {
        const { aResults, bResults } = invalidateAll();

        expect(aResults).toEqual([oldValue, newValue, newValue]);
        expect(bResults).toEqual([oldValue, newValue]);
      });
    });
  });

  function shouldNotConnectIfValid() {
    it('should not connect if valid', () => {
      const results: number[] = [];

      connectionsManager.connect$('a', () => of(oldValue)).subscribe();
      hooks.connecting.mockClear();
      hooks.connected.mockClear();
      connectionsManager.connect$('a', factoryMock).subscribe((v) => results.push(v));
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

      connectionsManager.connect$('a', factoryMock).subscribe((v) => results.push(v));
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

      connectionsManager.connect$('a', factoryMock).subscribe((v) => results.push(v));
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

      connectionsManager.connect$('a', () => of(oldValue)).subscribe((v) => results.push(v));
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

      connectionsManager.connect$('a', factoryMock).subscribe(
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
      const stream$ = connectionsManager.connect$('a', factoryMock);

      expect(hooks.connecting).not.toHaveBeenCalled();

      stream$.subscribe();

      expect(hooks.connecting).toHaveBeenCalled();
    });
  }

  function shouldManuallyValidate() {
    it('should manually validate', () => {
      const results: number[] = [];

      mockRxMap.set('a', newValue);
      connectionsManager.validate('a');
      connectionsManager.connect$('a', factoryMock).subscribe((v) => results.push(v));
      factorySubject$.next(oldValue);

      expect(results).toEqual([newValue]);
      expect(factoryMock).not.toHaveBeenCalled();
    });
  }

  function invalidate(): number[] {
    const results: number[] = [];

    connectionsManager
      .connect$('a', factoryMock)
      .pipe(take(1))
      .subscribe((v) => results.push(v));
    factorySubject$.next(oldValue);
    connectionsManager.invalidate('a');
    connectionsManager.connect$('a', factoryMock).subscribe((v) => results.push(v));
    factorySubject$.next(newValue);

    expect(factoryMock).toHaveBeenCalledTimes(2);

    return results;
  }

  function invalidateAll(): { aResults: number[]; bResults: number[] } {
    let subscription: Subscription;
    const aResults: number[] = [];
    const bResults: number[] = [];

    subscription = connectionsManager
      .connect$('a', () => of(oldValue))
      .subscribe((v) => aResults.push(v));
    subscription.unsubscribe();

    subscription = connectionsManager
      .connect$('b', () => of(oldValue))
      .subscribe((v) => bResults.push(v));
    subscription.unsubscribe();

    connectionsManager.invalidateAll();

    subscription = connectionsManager.connect$('a', factoryMock).subscribe((v) => aResults.push(v));
    factorySubject$.next(newValue);
    subscription.unsubscribe();

    subscription = connectionsManager.connect$('b', factoryMock).subscribe((v) => bResults.push(v));
    factorySubject$.next(newValue);
    subscription.unsubscribe();

    subscription = connectionsManager
      .connect$('a', factoryMock) // should not be called
      .subscribe((v) => aResults.push(v));
    factorySubject$.next(oldValue);
    subscription.unsubscribe();

    expect(factoryMock).toHaveBeenCalledTimes(2);

    return { aResults, bResults };
  }

  function connectAfterInvalid(): number[] {
    const results: number[] = [];

    connectionsManager.connect$('a', () => of(oldValue)).subscribe();
    hooks.connecting.mockClear();
    hooks.connected.mockClear();
    advanceTime(moreThanTimeout);
    connectionsManager.connect$('a', factoryMock).subscribe((v) => results.push(v));
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

    connectionsManager.connect$('a', () => of(oldValue)).subscribe();
    advanceTime(moreThanTimeout);
    connectionsManager.connect$('b', () => of(oldValue)).subscribe();
    connectionsManager.connect$('a', factoryMock).subscribe((v) => firstResults.push(v));
    connectionsManager.connect$('b', factoryMock).subscribe((v) => secondResults.push(v));
    factorySubject$.next(newValue);

    return { firstResults, secondResults };
  }

  function advanceTime(time: number): void {
    dateNowMock.mockReturnValue(dateNowMock() + time);
  }

  function makeConnectionsManager(strategy: 'eager' | 'lazy', scope: 'single' | 'all'): void {
    connectionsManager = new ConnectionsManager<string, number>(
      { timeout, scope, strategy },
      hooks,
    );
  }
});
