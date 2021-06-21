import { of, Subject } from 'rxjs';
import { Action, action, isAction } from './action';

describe('Action', () => {
  describe('id', () => {
    it('should be the same within each invocation', () => {
      const first$$ = new Subject<string>();
      const second$$ = new Subject<string>();
      const func = action((subject: Subject<any>) => subject.asObservable());

      let result: any;
      func.invoked$.subscribe((val) => (result = val));
      func.succeeded$.subscribe((val) => (result = val));

      func(first$$).subscribe();
      expect(result).toEqual({ id: 1, input: first$$ });

      func(second$$).subscribe();
      expect(result).toEqual({ id: 2, input: second$$ });

      first$$.next('a');
      expect(result).toEqual({ id: 1, input: first$$, output: 'a' });

      first$$.next('b');
      expect(result).toEqual({ id: 1, input: first$$, output: 'b' });

      second$$.next('c');
      expect(result).toEqual({ id: 2, input: second$$, output: 'c' });
    });
  });

  describe('execution', () => {
    it('should be executed after subscribe', () => {
      const spy = jest.fn();
      const func = action(() => {
        spy();
      });

      func();
      expect(spy).not.toHaveBeenCalled();

      func().subscribe();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should work with no arguments', (done) => {
      const func = action();

      func().subscribe((res) => {
        expect(res).toBe(undefined);
        done();
      });
    });

    it('should work with no input nor result', (done) => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const func = action(() => {});

      func().subscribe((res) => {
        expect(res).toBe(undefined);
        done();
      });
    });

    it('should work with no input', (done) => {
      const func = action(() => of('foo'));

      func().subscribe((res) => {
        expect(res).toBe('foo');
        done();
      });
    });

    it('should work with no output', (done) => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const func = action((foo: string) => {});

      func('bar').subscribe((res) => {
        expect(res).toBe(undefined);
        done();
      });
    });

    it('should work with input and output', (done) => {
      const func = action((foo: string) => of(foo));

      func('bar').subscribe((res) => {
        expect(res).toBe('bar');
        done();
      });
    });
  });

  describe('hooks', () => {
    let invoked: jest.Mock;
    let succeeded: jest.Mock;
    let failed: jest.Mock;
    let completed: jest.Mock;
    let result$$: Subject<number>;
    let func: Action<string, number>;

    beforeEach(() => {
      result$$ = new Subject<number>();
      func = action((input: string) => result$$.asObservable());
      invoked = jest.fn();
      func.invoked$.subscribe(invoked);
      succeeded = jest.fn();
      func.succeeded$.subscribe(succeeded);
      failed = jest.fn();
      func.failed$.subscribe(failed);
      completed = jest.fn();
      func.completed$.subscribe(completed);
    });

    it('should call invoked', () => {
      func('a').subscribe();
      expect(invoked).toHaveBeenCalledWith({ id: 1, input: 'a' });

      func('b').subscribe();
      expect(invoked).toHaveBeenCalledWith({ id: 2, input: 'b' });
    });

    it('should call succeeded', () => {
      func('a').subscribe();

      result$$.next(10);
      expect(succeeded).toHaveBeenCalledWith({ id: 1, input: 'a', output: 10 });

      result$$.next(20);
      expect(succeeded).toHaveBeenCalledWith({ id: 1, input: 'a', output: 20 });
    });

    it('should call failed', () => {
      func('a').subscribe();

      const error = new Error('something went wrong');
      result$$.error(error);
      expect(failed).toHaveBeenCalledWith({ id: 1, input: 'a', error: error });
    });

    it('should call completed', () => {
      func('a').subscribe();

      result$$.complete();
      expect(completed).toHaveBeenCalledWith({ id: 1, input: 'a' });
    });
  });

  describe('isAction', () => {
    it('should return true for action', () => {
      const func = action();

      expect(isAction(func)).toBe(true);
    });

    it('should return false for function', () => {
      const func = () => null;

      expect(isAction(func)).toBe(false);
    });

    it('should return false for object', () => {
      const obj = {};

      expect(isAction(obj)).toBe(false);
    });

    it('should return false for primitive', () => {
      const primitive = 'foo';

      expect(isAction(primitive)).toBe(false);
    });
  });
});
