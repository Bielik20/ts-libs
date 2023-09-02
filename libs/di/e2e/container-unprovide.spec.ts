import 'reflect-metadata';
import { Container, Injectable, Scope } from '@ns3/di';

@Injectable()
class TestClass {}

const TEST_VALUE = {};

describe('Container - unprovide', () => {
  test('global', () => {
    const container = Container.make();
    container.provide({ token: TestClass, useValue: TEST_VALUE, scope: Scope.Global });

    const instance1 = container.get(TestClass);
    expect(instance1).toBe(TEST_VALUE);

    container.unprovide(TestClass, { local: true });

    const instance2 = container.get(TestClass);
    expect(instance2).toBe(instance1);

    container.unprovide(TestClass, { global: true });

    const instance3 = container.get(TestClass);
    expect(instance3).not.toBe(instance1);
  });

  test('local', () => {
    const container = Container.make();
    container.provide({ token: TestClass, useValue: TEST_VALUE, scope: Scope.Local });

    const instance1 = container.get(TestClass);
    expect(instance1).toBe(TEST_VALUE);

    container.unprovide(TestClass, { global: true });

    const instance2 = container.get(TestClass);
    expect(instance2).toBe(instance1);

    container.unprovide(TestClass, { local: true });

    const instance3 = container.get(TestClass);
    expect(instance3).not.toBe(instance1);
  });

  test('all', () => {
    const container = Container.make();
    container.provide({ token: TestClass, useValue: TEST_VALUE, scope: Scope.Local });

    const instance1 = container.get(TestClass);
    expect(instance1).toBe(TEST_VALUE);

    container.unprovide(TestClass);

    const instance2 = container.get(TestClass);
    expect(instance2).not.toBe(instance1);

    container.unprovide(TestClass);

    const instance3 = container.get(TestClass);
    expect(instance3).not.toBe(instance1);
  });
});
