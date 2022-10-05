import 'reflect-metadata';
import { Container, Injectable, Scope } from '@ns3/di';

@Injectable()
class TestClass {}

const TEST_VALUE = {};

describe('Container - reset', () => {
  test('reset global', () => {
    const container = Container.make();
    container.set({ bind: TestClass, value: TEST_VALUE, scope: Scope.Global });

    const instance1 = container.get(TestClass);
    expect(instance1).toBe(TEST_VALUE);

    container.resetLocal(TestClass);

    const instance2 = container.get(TestClass);
    expect(instance2).toBe(instance1);

    container.resetGlobal(TestClass);

    const instance3 = container.get(TestClass);
    expect(instance3).not.toBe(instance1);
  });

  test('reset local', () => {
    const container = Container.make();
    container.set({ bind: TestClass, value: TEST_VALUE, scope: Scope.Local });

    const instance1 = container.get(TestClass);
    expect(instance1).toBe(TEST_VALUE);

    container.resetGlobal(TestClass);

    const instance2 = container.get(TestClass);
    expect(instance2).toBe(instance1);

    container.resetLocal(TestClass);

    const instance3 = container.get(TestClass);
    expect(instance3).not.toBe(instance1);
  });
});
