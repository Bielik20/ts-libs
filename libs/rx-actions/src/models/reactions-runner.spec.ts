import { Observable, of, Subject, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Reaction, reaction } from './reaction';
import { ReactionsRunner } from './reactions-runner';

describe('ReactionsRunner', () => {
  let runner: ReactionsRunner;
  let trigger$$: Subject<Observable<string>>;
  let spy: jest.Mock<Observable<string>, []>;
  let func: Reaction<string>;
  let succeeded: jest.Mock;
  let failed: jest.Mock;
  let completed: jest.Mock;

  beforeEach(() => {
    runner = new ReactionsRunner();
    trigger$$ = new Subject<Observable<string>>();
    spy = jest.fn(() => trigger$$.pipe(mergeMap((value) => value)));
    func = reaction(spy);
    succeeded = jest.fn();
    failed = jest.fn();
    completed = jest.fn();
    func.succeeded$.subscribe(succeeded);
    func.failed$.subscribe(failed);
    func.completed$.subscribe(completed);
  });

  describe('start', () => {
    it('should subscribe to reaction only once', () => {
      runner.startMany([func]);
      expect(spy).toHaveBeenCalledTimes(1);

      runner.startMany([func]);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('stop', () => {
    it('should unsubscribe reaction', () => {
      runner.startMany([func]);
      expect(trigger$$.observed).toBe(true);

      runner.stopMany([func]);
      expect(trigger$$.observed).toBe(false);
    });
  });

  describe('start after stop', () => {
    it('should be able to resubscribe', () => {
      runner.startMany([func]);
      expect(trigger$$.observed).toBe(true);

      runner.stopMany([func]);
      expect(trigger$$.observed).toBe(false);

      runner.startMany([func]);
      expect(trigger$$.observed).toBe(true);
    });
  });

  describe('clear', () => {
    it('should unsubscribe reaction', () => {
      runner.startMany([func]);
      expect(trigger$$.observed).toBe(true);

      runner.clear();
      expect(trigger$$.observed).toBe(false);
    });
  });

  describe('error handler', () => {
    it('should handle error', () => {
      const first$$ = new Subject<string>();
      const second$$ = new Subject<string>();

      runner.startMany([func]);
      expect(spy).toHaveBeenCalledTimes(1);

      trigger$$.next(first$$);
      trigger$$.next(second$$);
      expect(succeeded).toHaveBeenCalledTimes(0);

      first$$.next('a');
      expect(succeeded).toHaveBeenCalledTimes(1);

      second$$.next('b');
      expect(succeeded).toHaveBeenCalledTimes(2);

      first$$.next('c');
      expect(succeeded).toHaveBeenCalledTimes(3);

      second$$.error(new Error()); // cancels all previous streams
      expect(failed).toHaveBeenCalledTimes(1);

      first$$.next('d');
      expect(succeeded).toHaveBeenCalledTimes(3); // because of error

      trigger$$.next(of('e'));
      expect(succeeded).toHaveBeenCalledTimes(4); // new ones are fine

      expect(trigger$$.observed).toBe(true);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('hooks', () => {
    it('should call succeeded', () => {
      runner.startMany([func]);

      trigger$$.next(of('a'));
      expect(succeeded).toHaveBeenCalledWith('a');

      trigger$$.next(of('b'));
      expect(succeeded).toHaveBeenCalledWith('b');
    });

    it('should call failed', () => {
      runner.startMany([func]);

      const error = new Error('something went wrong');
      trigger$$.next(throwError(() => error));
      expect(failed).toHaveBeenCalledWith(error);
    });

    it('should call completed', () => {
      runner.startMany([func]);

      trigger$$.complete();
      expect(completed).toHaveBeenCalledWith(undefined);
    });
  });
});
