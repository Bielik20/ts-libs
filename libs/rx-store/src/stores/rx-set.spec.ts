import { RxSet } from './rx-set';

describe('RxSet', () => {
  let rxSet: RxSet<string>;

  beforeEach(() => {
    rxSet = new RxSet<string>();
  });

  it('should start with false values', () => {
    const aValues: boolean[] = [];
    const sizeValues: number[] = [];

    rxSet.has('a').subscribe((v) => aValues.push(v));
    rxSet.size().subscribe((v) => sizeValues.push(v));

    expect(aValues).toEqual([false]);
    expect(sizeValues).toEqual([0]);
  });

  describe('has', () => {
    it('should should only emit on change value', () => {
      const aValues: boolean[] = [];

      rxSet.has('a').subscribe((v) => aValues.push(v));

      rxSet.delete('a');
      rxSet.delete('a');

      expect(aValues).toEqual([false]);

      rxSet.add('a');

      expect(aValues).toEqual([false, true]);

      rxSet.add('a');
      rxSet.add('a');
      rxSet.delete('a');

      expect(aValues).toEqual([false, true, false]);
    });
  });

  describe('size and keys', () => {
    it('should change when either value changes', () => {
      const aValues: boolean[] = [];
      const bValues: boolean[] = [];
      const sizeValues: number[] = [];
      const keysValues: string[][] = [];

      rxSet.has('a').subscribe((v) => aValues.push(v));
      rxSet.has('b').subscribe((v) => bValues.push(v));
      rxSet.size().subscribe((v) => sizeValues.push(v));
      rxSet.keys().subscribe((v) => keysValues.push(v));

      rxSet.add('a');

      expect(aValues).toEqual([false, true]);
      expect(bValues).toEqual([false]);
      expect(sizeValues).toEqual([0, 1]);
      expect(keysValues).toEqual([[], ['a']]);

      rxSet.add('b');

      expect(aValues).toEqual([false, true]);
      expect(bValues).toEqual([false, true]);
      expect(sizeValues).toEqual([0, 1, 2]);
      expect(keysValues).toEqual([[], ['a'], ['a', 'b']]);

      rxSet.delete('a');

      expect(aValues).toEqual([false, true, false]);
      expect(bValues).toEqual([false, true]);
      expect(sizeValues).toEqual([0, 1, 2, 1]);
      expect(keysValues).toEqual([[], ['a'], ['a', 'b'], ['b']]);

      rxSet.delete('b');

      expect(aValues).toEqual([false, true, false]);
      expect(bValues).toEqual([false, true, false]);
      expect(sizeValues).toEqual([0, 1, 2, 1, 0]);
      expect(keysValues).toEqual([[], ['a'], ['a', 'b'], ['b'], []]);
    });

    it('should be 1 value if started with true', () => {
      const aValues: boolean[] = [];
      const sizeValues: number[] = [];
      const keysValues: string[][] = [];

      rxSet.add('a');

      rxSet.has('a').subscribe((v) => aValues.push(v));
      rxSet.size().subscribe((v) => sizeValues.push(v));
      rxSet.keys().subscribe((v) => keysValues.push(v));

      expect(aValues).toEqual([true]);
      expect(sizeValues).toEqual([1]);
      expect(keysValues).toEqual([['a']]);
    });
  });

  describe('clear', () => {
    it('should emit only one per clear', () => {
      rxSet.add('a');
      rxSet.add('b');
      rxSet.add('c');

      const sizeValues: number[] = [];

      rxSet.size().subscribe((v) => sizeValues.push(v));

      rxSet.clear();

      expect(sizeValues).toEqual([3, 0]);

      rxSet.clear();

      expect(sizeValues).toEqual([3, 0]);
    });
  });
});
