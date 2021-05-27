import { RxObject } from './rx-object';

interface TestObject {
  foo: string;
  bar: string;
  wrap: {
    first: string;
    second: string;
  };
}

describe('RxObject', () => {
  const initialValue = {
    foo: 'FOO',
    bar: 'BAR',
    wrap: {
      first: 'FIRST',
      second: 'SECOND',
    },
  };
  let rxObject$: RxObject<TestObject>;

  beforeEach(() => {
    rxObject$ = new RxObject<TestObject>(initialValue);
  });

  describe('patch', () => {
    it('should update only a part of state', () => {
      const results: TestObject[] = [];

      rxObject$.subscribe((v) => results.push(v));
      rxObject$.patch({ foo: 'new' });
      rxObject$.patch({ foo: 'new-new', bar: 'new' });

      expect(results).toEqual([
        initialValue,
        { ...initialValue, foo: 'new' },
        { ...initialValue, foo: 'new-new', bar: 'new' },
      ]);
    });
  });

  describe('reset', () => {
    it('should restore initial state', () => {
      const results: TestObject[] = [];

      rxObject$.subscribe((v) => results.push(v));
      rxObject$.patch({ foo: 'new' });
      rxObject$.reset();

      expect(results).toEqual([initialValue, { ...initialValue, foo: 'new' }, initialValue]);
    });
  });

  describe('fragment', () => {
    it('should emit only when fragment changes', () => {
      const results: TestObject['wrap'][] = [];
      const newWrap: TestObject['wrap'] = {
        first: 'new',
        second: 'new',
      };

      rxObject$.fragment$('wrap').subscribe((v) => results.push(v));
      rxObject$.patch({ foo: 'new' });
      rxObject$.reset();

      expect(results).toEqual([initialValue.wrap]);

      rxObject$.patch({ wrap: newWrap });

      expect(results).toEqual([initialValue.wrap, newWrap]);
    });
  });
});
