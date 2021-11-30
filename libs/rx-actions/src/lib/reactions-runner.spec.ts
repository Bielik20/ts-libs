import { mergeMap, Observable, Subject } from 'rxjs';
import { Reaction, reaction } from './reaction';
import { ReactionsRunner } from './reactions-runner';

describe('ReactionsRunner', () => {
  let runner: ReactionsRunner;
  let trigger$$: Subject<Observable<string>>;
  let spy: jest.Mock<Observable<string>, []>;
  let func: Reaction<string>;

  beforeEach(() => {
    runner = new ReactionsRunner();
    trigger$$ = new Subject<Observable<string>>();
    spy = jest.fn(() => trigger$$.pipe(mergeMap((value) => value)));
    func = reaction(spy);
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

      runner.startMany([func]);
      expect(spy).toHaveBeenCalledTimes(1);

      trigger$$.next(first$$);
      first$$.error(new Error());

      expect(trigger$$.observed).toBe(true);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
