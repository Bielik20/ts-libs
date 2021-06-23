import { EMPTY, of, throwError } from 'rxjs';
import { isReaction, reaction } from './reaction';

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
