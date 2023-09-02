import 'reflect-metadata';
import { Container, Inject, Injectable, Optional } from '@ns3/di';

describe('Optional', () => {
  describe('without optional', () => {
    @Injectable()
    class TestClassWithAnyDep {
      constructor(readonly dep: any) {}
    }

    test('throw', () => {
      const container = Container.make();

      expect(() => container.get(TestClassWithAnyDep)).toThrow(
        'function Object() { [native code] } is not bound to anything.',
      );
    });
  });

  describe('with optional', () => {
    @Injectable()
    class TestClassWithAnyDep {
      constructor(@Optional() readonly dep: any) {}
    }

    test('inject undefined', () => {
      const container = Container.make();
      const instance = container.get(TestClassWithAnyDep);

      expect(instance.dep).toBe(undefined);
    });
  });

  describe('with optional and inject', () => {
    const symbol = Symbol('symbol');

    @Injectable()
    class TestClassWithAnyDep {
      constructor(@Optional() @Inject(symbol) readonly dep: any) {}
    }

    test('symbol unprovided', () => {
      const container = Container.make();
      const instance = container.get(TestClassWithAnyDep);

      expect(instance.dep).toBe(undefined);
    });

    test('symbol provided', () => {
      const container = Container.make();
      container.provide({ token: symbol, useValue: 'value' });
      const instance = container.get(TestClassWithAnyDep);

      expect(instance.dep).toBe('value');
    });
  });

  describe('with inject and optional', () => {
    const symbol = Symbol('symbol');

    @Injectable()
    class TestClassWithAnyDep {
      constructor(@Inject(symbol) @Optional() readonly dep: any) {}
    }

    test('symbol unprovided', () => {
      const container = Container.make();
      const instance = container.get(TestClassWithAnyDep);

      expect(instance.dep).toBe(undefined);
    });

    test('symbol provided', () => {
      const container = Container.make();
      container.provide({ token: symbol, useValue: 'value' });
      const instance = container.get(TestClassWithAnyDep);

      expect(instance.dep).toBe('value');
    });
  });
});
