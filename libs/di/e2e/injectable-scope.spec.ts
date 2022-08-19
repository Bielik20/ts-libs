import 'reflect-metadata';
import { Container, Injectable, Scope } from '@ns3/di';

describe('Injectable - scope', () => {
  describe('Global', () => {
    @Injectable({ scope: Scope.Global })
    class TestGlobalClass {}

    test('return the same instance from different container', () => {
      const container1 = Container.make();
      const container2 = container1.clone();
      const instance1 = container1.get(TestGlobalClass);
      const instance2 = container2.get(TestGlobalClass);

      expect(instance1).toBe(instance2);
    });
  });

  describe('Local', () => {
    @Injectable({ scope: Scope.Local })
    class TestLocalClass {}

    test('return different instance from different container', () => {
      const container1 = Container.make();
      const container2 = container1.clone();
      const instance1 = container1.get(TestLocalClass);
      const instance2 = container2.get(TestLocalClass);

      expect(instance1).not.toBe(instance2);
    });

    test('return the same instance from the same container', () => {
      const container1 = Container.make();
      const instance1 = container1.get(TestLocalClass);
      const instance2 = container1.get(TestLocalClass);

      expect(instance1).toBe(instance2);
    });
  });

  describe('Transient', () => {
    @Injectable({ scope: Scope.Transient })
    class TestTransientClass {}

    test('return the different instance from the same container', () => {
      const container1 = Container.make();
      const instance1 = container1.get(TestTransientClass);
      const instance2 = container1.get(TestTransientClass);

      expect(instance1).not.toBe(instance2);
    });
  });
});
