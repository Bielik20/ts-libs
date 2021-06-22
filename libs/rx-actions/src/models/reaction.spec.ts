import { EMPTY, of, Subject, throwError } from 'rxjs';
import { getReactionConfig, isReaction, Reaction, reaction } from './reaction';

describe('Reaction', () => {
  describe('execution', () => {
    it('should return value', (done) => {
      const func = reaction(() => of('success'));

      func().subscribe((val) => {
        expect(val).toEqual('success');
        done();
      });
    });

    it('should complete', (done) => {
      const func = reaction(() => EMPTY);

      func().subscribe({
        complete: () => {
          done();
        },
      });
    });

    it('should error', (done) => {
      const error = new Error();
      const func = reaction(() => throwError(() => error));

      func().subscribe({
        error: (err) => {
          expect(err).toEqual(error);
          done();
        },
      });
    });
  });

  describe('hooks', () => {
    let succeeded: jest.Mock;
    let failed: jest.Mock;
    let completed: jest.Mock;
    let result$$: Subject<number>;
    let func: Reaction<number>;

    beforeEach(() => {
      result$$ = new Subject<number>();
      func = reaction(() => result$$.asObservable());
      succeeded = jest.fn();
      func.succeeded$.subscribe(succeeded);
      failed = jest.fn();
      func.failed$.subscribe(failed);
      completed = jest.fn();
      func.completed$.subscribe(completed);
    });

    it('should call succeeded', () => {
      func().subscribe();

      result$$.next(10);
      expect(succeeded).toHaveBeenCalledWith(10);

      result$$.next(20);
      expect(succeeded).toHaveBeenCalledWith(10);
    });

    it('should call failed', () => {
      func().subscribe();

      const error = new Error('something went wrong');
      result$$.error(error);
      expect(failed).toHaveBeenCalledWith(error);
    });

    it('should call completed', () => {
      func().subscribe();

      result$$.complete();
      expect(completed).toHaveBeenCalledWith(undefined);
    });
  });

  describe('config', () => {
    it('should contain default config', () => {
      const func = reaction(() => EMPTY);
      const config = getReactionConfig(func);

      expect(config).toEqual({ rerunFailed: true, rerunCompleted: true });
    });

    it('should contain provided config', () => {
      const func = reaction(() => EMPTY, { rerunFailed: false, rerunCompleted: false });
      const config = getReactionConfig(func);

      expect(config).toEqual({ rerunFailed: false, rerunCompleted: false });
    });

    it('should overwrite rerunFailed', () => {
      const func = reaction(() => EMPTY, { rerunFailed: false });
      const config = getReactionConfig(func);

      expect(config).toEqual({ rerunFailed: false, rerunCompleted: true });
    });

    it('should overwrite resubscribeCompleted', () => {
      const func = reaction(() => EMPTY, { rerunCompleted: false });
      const config = getReactionConfig(func);

      expect(config).toEqual({ rerunFailed: true, rerunCompleted: false });
    });
  });

  describe('isReaction', () => {
    it('should return true for reaction', () => {
      const func = reaction(() => EMPTY);

      expect(isReaction(func)).toBe(true);
    });

    it('should return false for function', () => {
      const func = () => null;

      expect(isReaction(func)).toBe(false);
    });

    it('should return false for object', () => {
      const obj = {};

      expect(isReaction(obj)).toBe(false);
    });

    it('should return false for primitive', () => {
      const primitive = 'foo';

      expect(isReaction(primitive)).toBe(false);
    });
  });
});
