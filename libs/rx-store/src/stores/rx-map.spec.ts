import { Change } from '../models/change';
import { RxMap } from './rx-map';

describe('RxMap', () => {
  let rxMap: RxMap<string, string>;

  beforeEach(() => {
    rxMap = new RxMap<string, string>();
  });

  it('should start with undefined values', () => {
    const aValues: string[] = [];

    rxMap.get('a').subscribe((v) => aValues.push(v));

    expect(aValues).toEqual([undefined]);
  });

  describe('get, set, delete', () => {
    it('should should only emit on change value', () => {
      const aValues: string[] = [];

      rxMap.get('a').subscribe((v) => aValues.push(v));

      rxMap.set('a', 'foo');
      rxMap.delete('a');

      expect(aValues).toEqual([undefined, 'foo', undefined]);

      rxMap.set('a', 'foo');

      expect(aValues).toEqual([undefined, 'foo', undefined, 'foo']);

      rxMap.set('a', 'foo');
      rxMap.set('a', 'foo');
      rxMap.set('a', 'bar');

      expect(aValues).toEqual([undefined, 'foo', undefined, 'foo', 'bar']);
    });
  });

  describe('keys, values, entries', () => {
    it('should change when either value changes', () => {
      const aValues: string[] = [];
      const bValues: string[] = [];
      const keys: string[][] = [];
      const values: string[][] = [];
      const entries: [string, string][][] = [];

      rxMap.get('a').subscribe((v) => aValues.push(v));
      rxMap.get('b').subscribe((v) => bValues.push(v));
      rxMap.keys().subscribe((v) => keys.push(v));
      rxMap.values().subscribe((v) => values.push(v));
      rxMap.entries().subscribe((v) => entries.push(v));

      rxMap.set('a', 'foo');

      expect(aValues).toEqual([undefined, 'foo']);
      expect(bValues).toEqual([undefined]);
      expect(keys).toEqual([[], ['a']]);
      expect(values).toEqual([[], ['foo']]);
      expect(entries).toEqual([[], [['a', 'foo']]]);

      rxMap.set('b', 'bar');

      expect(aValues).toEqual([undefined, 'foo']);
      expect(bValues).toEqual([undefined, 'bar']);
      expect(keys).toEqual([[], ['a'], ['a', 'b']]);
      expect(values).toEqual([[], ['foo'], ['foo', 'bar']]);
      expect(entries).toEqual([
        [],
        [['a', 'foo']],
        [
          ['a', 'foo'],
          ['b', 'bar'],
        ],
      ]);

      rxMap.delete('a');

      expect(aValues).toEqual([undefined, 'foo', undefined]);
      expect(bValues).toEqual([undefined, 'bar']);
      expect(keys).toEqual([[], ['a'], ['a', 'b'], ['b']]);
      expect(values).toEqual([[], ['foo'], ['foo', 'bar'], ['bar']]);
      expect(entries).toEqual([
        [],
        [['a', 'foo']],
        [
          ['a', 'foo'],
          ['b', 'bar'],
        ],
        [['b', 'bar']],
      ]);
    });

    it('should be 1 value if set before get', () => {
      const aValues: string[] = [];
      const keys: string[][] = [];
      const values: string[][] = [];
      const entries: [string, string][][] = [];

      rxMap.set('a', 'foo');

      rxMap.get('a').subscribe((v) => aValues.push(v));
      rxMap.keys().subscribe((v) => keys.push(v));
      rxMap.values().subscribe((v) => values.push(v));
      rxMap.entries().subscribe((v) => entries.push(v));

      expect(aValues).toEqual(['foo']);
      expect(keys).toEqual([['a']]);
      expect(values).toEqual([['foo']]);
      expect(entries).toEqual([[['a', 'foo']]]);
    });
  });

  describe('clear', () => {
    it('should emit only one per clear', () => {
      rxMap.set('a', 'a');
      rxMap.set('b', 'b');
      rxMap.set('c', 'c');

      const keys: string[][] = [];

      rxMap.keys().subscribe((v) => keys.push(v));

      rxMap.clear();

      expect(keys).toEqual([['a', 'b', 'c'], []]);

      rxMap.clear();

      expect(keys).toEqual([['a', 'b', 'c'], []]);
    });
  });

  describe('setMany', () => {
    it('should emit only one per setMany', () => {
      const keys: string[][] = [];

      rxMap.keys().subscribe((v) => keys.push(v));

      rxMap.setMany([
        ['aKey', 'aValue'],
        ['bKey', 'bValue'],
      ]);

      expect(keys).toEqual([[], ['aKey', 'bKey']]);
    });
  });

  describe('change$', () => {
    it('should emit change objects for individual set', () => {
      const changes: Change<string, string>[] = [];

      rxMap.change$.subscribe((v) => changes.push(v));
      rxMap.set('a', 'a1');
      rxMap.set('b', 'b1');
      rxMap.set('a', 'a2');

      expect(changes).toEqual([
        { key: 'a', oldValue: undefined, newValue: 'a1' },
        { key: 'b', oldValue: undefined, newValue: 'b1' },
        { key: 'a', oldValue: 'a1', newValue: 'a2' },
      ]);
    });

    it('should emit change objects for setMany', () => {
      const changes: Change<string, string>[] = [];

      rxMap.change$.subscribe((v) => changes.push(v));
      rxMap.setMany([
        ['aKey', 'aValue'],
        ['bKey', 'bValue'],
      ]);

      expect(changes).toEqual([
        { key: 'aKey', oldValue: undefined, newValue: 'aValue' },
        { key: 'bKey', oldValue: undefined, newValue: 'bValue' },
      ]);
    });
  });
});
