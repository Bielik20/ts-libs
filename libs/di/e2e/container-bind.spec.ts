import 'reflect-metadata';
import { Container, Injectable, Scope } from '@ns3/di';

describe('Container - provide', () => {
  describe('factory', () => {
    @Injectable()
    class DependencyClass {}

    @Injectable()
    class MasterClass {
      constructor(public dep: any) {}
    }

    test('create instance', () => {
      const container = Container.make();
      container.provide({
        token: MasterClass,
        useFactory: (innerContainer: Container, requesterScope: Scope) => {
          const dep = innerContainer.get(DependencyClass, requesterScope);

          return new MasterClass(dep);
        },
      });

      const instance = container.get(MasterClass);

      expect(instance.dep).toBeInstanceOf(DependencyClass);
    });
  });

  describe('value', () => {
    class TestClass {}
    const TEST_VALUE = new TestClass();

    test('create instance', () => {
      const container = Container.make();
      container.provide({
        token: TestClass,
        useValue: TEST_VALUE,
      });

      const instance = container.get(TestClass);

      expect(instance).toBe(TEST_VALUE);
    });
  });

  describe('Class', () => {
    class TestFooClass {}

    @Injectable()
    class TestBarClass {}

    test('create instance', () => {
      const container = Container.make();
      container.provide({
        token: TestFooClass,
        useClass: TestBarClass,
      });

      const instance = container.get(TestFooClass);

      expect(instance).toBeInstanceOf(TestBarClass);
    });
  });
});
