import 'reflect-metadata';
import { BindingConfig, Container, Injectable, Scope } from '@ns3/di';

describe('Container - scope', () => {
  @Injectable()
  class TestClass {}

  describe('Global', () => {
    const config: BindingConfig<TestClass> = {
      bind: TestClass,
      klass: TestClass,
      scope: Scope.Global,
    };

    test('return the same instance from different container', () => {
      const container1 = Container.make();
      const container2 = container1.clone();

      container1.bind(config);
      container2.bind(config);

      const instance1 = container1.get(TestClass);
      const instance2 = container2.get(TestClass);

      expect(instance1).toBe(instance2);
    });
  });

  describe('Local', () => {
    const config: BindingConfig<TestClass> = {
      bind: TestClass,
      klass: TestClass,
      scope: Scope.Local,
    };

    test('return different instance from different container', () => {
      const container1 = Container.make();
      const container2 = container1.clone();

      container1.bind(config);
      container2.bind(config);

      const instance1 = container1.get(TestClass);
      const instance2 = container2.get(TestClass);

      expect(instance1).not.toBe(instance2);
    });

    test('return the same instance from the same container', () => {
      const container1 = Container.make();

      container1.bind(config);

      const instance1 = container1.get(TestClass);
      const instance2 = container1.get(TestClass);

      expect(instance1).toBe(instance2);
    });
  });

  describe('Transient', () => {
    const config: BindingConfig<TestClass> = {
      bind: TestClass,
      klass: TestClass,
      scope: Scope.Transient,
    };

    test('return the different instance from the same container', () => {
      const container1 = Container.make();

      container1.bind(config);

      const instance1 = container1.get(TestClass);
      const instance2 = container1.get(TestClass);

      expect(instance1).not.toBe(instance2);
    });
  });
});
