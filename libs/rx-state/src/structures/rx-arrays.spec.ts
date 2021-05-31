import { RxArrays } from './rx-arrays';
import { RxMap } from './rx-map';

interface Item {
  id: string;
  value: number;
}

describe('RxArrays', () => {
  let rxArrays: RxArrays<string, RxMap<string, Item>>;
  let itemsMap: RxMap<string, Item>;

  beforeEach(() => {
    itemsMap = new RxMap<string, Item>();
    rxArrays = new RxArrays<string, RxMap<string, Item>>({
      itemsMap,
      keyMapper: (item) => item.id,
    });
  });

  it('should start with undefined values', () => {
    const aValues: Item[][] = [];

    rxArrays.get$('default').subscribe((v) => aValues.push(v));

    expect(aValues).toEqual([undefined]);
  });

  describe('get, set, delete', () => {
    it('should should only emit on change value', () => {
      const aValues: Item[][] = [];

      rxArrays.get$('default').subscribe((v) => aValues.push(v));
      rxArrays.set('default', [{ id: 'a', value: 1 }]);
      rxArrays.delete('default');
      rxArrays.set('default', [{ id: 'a', value: 2 }]);

      expect(aValues).toEqual([
        undefined,
        [{ id: 'a', value: 1 }],
        undefined,
        [{ id: 'a', value: 2 }],
      ]);
    });
  });

  describe('append', () => {
    it('should add values to the end of array', () => {
      const aValues: Item[][] = [];

      rxArrays.set('default', [{ id: 'start', value: 1 }]);
      rxArrays.get$('default').subscribe((v) => aValues.push(v));
      rxArrays.append('default', [
        { id: 'a', value: 2 },
        { id: 'b', value: 2 },
      ]);

      expect(aValues).toEqual([
        [{ id: 'start', value: 1 }],
        [
          { id: 'start', value: 1 },
          { id: 'a', value: 2 },
          { id: 'b', value: 2 },
        ],
      ]);
    });
  });

  describe('prepend', () => {
    it('should add values to the beginning of array', () => {
      const aValues: Item[][] = [];

      rxArrays.set('default', [{ id: 'start', value: 1 }]);
      rxArrays.get$('default').subscribe((v) => aValues.push(v));
      rxArrays.prepend('default', [
        { id: 'a', value: 2 },
        { id: 'b', value: 2 },
      ]);

      expect(aValues).toEqual([
        [{ id: 'start', value: 1 }],
        [
          { id: 'a', value: 2 },
          { id: 'b', value: 2 },
          { id: 'start', value: 1 },
        ],
      ]);
    });
  });

  describe('removeItems', () => {
    it('should add values to the beginning of array', () => {
      const aValues: Item[][] = [];

      rxArrays.set('default', [
        { id: 'a', value: 1 },
        { id: 'b', value: 2 },
        { id: 'c', value: 3 },
      ]);
      rxArrays.get$('default').subscribe((v) => aValues.push(v));
      rxArrays.removeItems('default', ['a', 'c']);

      expect(aValues).toEqual([
        [
          { id: 'a', value: 1 },
          { id: 'b', value: 2 },
          { id: 'c', value: 3 },
        ],
        [{ id: 'b', value: 2 }],
      ]);
    });
  });

  describe('clear', () => {
    it('should remove every array', () => {
      const aValues: Item[][] = [];
      const bValues: Item[][] = [];

      rxArrays.set('arrayA', [{ id: 'a', value: 1 }]);
      rxArrays.set('arrayB', [{ id: 'b', value: 1 }]);
      rxArrays.get$('arrayA').subscribe((v) => aValues.push(v));
      rxArrays.get$('arrayB').subscribe((v) => bValues.push(v));

      rxArrays.clear();

      expect(aValues).toEqual([[{ id: 'a', value: 1 }], undefined]);
      expect(bValues).toEqual([[{ id: 'b', value: 1 }], undefined]);
    });
  });

  describe('two arrays', () => {
    it('should be able to update the same data', () => {
      const aValues: Item[][] = [];
      const bValues: Item[][] = [];

      rxArrays.get$('arrayA').subscribe((v) => aValues.push(v));
      rxArrays.get$('arrayB').subscribe((v) => bValues.push(v));
      rxArrays.set('arrayA', [{ id: 'a', value: 1 }]);
      rxArrays.set('arrayB', [{ id: 'a', value: 2 }]);

      expect(aValues).toEqual([undefined, [{ id: 'a', value: 1 }], [{ id: 'a', value: 2 }]]);
      expect(bValues).toEqual([undefined, [{ id: 'a', value: 2 }]]);
    });
  });

  describe('updates to itemsMap', () => {
    it('should update associated array', () => {
      const aValues: Item[][] = [];

      rxArrays.set('default', [
        { id: 'a', value: 1 },
        { id: 'b', value: 2 },
      ]);
      rxArrays.get$('default').subscribe((v) => aValues.push(v));
      itemsMap.set('a', { id: 'a', value: 10 });
      itemsMap.delete('b');

      expect(aValues).toEqual([
        [
          { id: 'a', value: 1 },
          { id: 'b', value: 2 },
        ],
        [
          { id: 'a', value: 10 },
          { id: 'b', value: 2 },
        ],
        [{ id: 'a', value: 10 }],
      ]);
    });
  });

  describe('setting multiple items on array', () => {
    it('should emit only one itemsMap change', () => {
      const itemKeys: string[][] = [];

      itemsMap.keys$().subscribe((v) => itemKeys.push(v));
      rxArrays.set('default', [
        { id: 'a', value: 1 },
        { id: 'b', value: 2 },
      ]);

      expect(itemKeys).toEqual([[], ['a', 'b']]);
    });
  });
});
