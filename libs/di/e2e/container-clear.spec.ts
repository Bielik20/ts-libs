import 'reflect-metadata';
import { Container, Injectable, Scope } from '@ns3/di';

@Injectable({ scope: Scope.Local })
class TestLocalClass {}

@Injectable({ scope: Scope.Global })
class TestGlobalClass {}

const TEST_VALUE = {};

describe('Container - clear', () => {
  test('clear only global', () => {
    const container = Container.make();
    container.set({ bind: TestGlobalClass, value: TEST_VALUE, scope: Scope.Global });
    const global1 = container.get(TestGlobalClass);
    const local1 = container.get(TestLocalClass);

    expect(global1).toBe(TEST_VALUE);

    container.clearGlobal();
    const global2 = container.get(TestGlobalClass);
    const local2 = container.get(TestLocalClass);

    expect(global1).not.toBe(global2);
    expect(local1).toBe(local2);
    expect(global2).toBeInstanceOf(TestGlobalClass);
  });

  test('clear only local', () => {
    const container = Container.make();
    container.set({ bind: TestLocalClass, value: TEST_VALUE, scope: Scope.Local });
    const global1 = container.get(TestGlobalClass);
    const local1 = container.get(TestLocalClass);

    expect(local1).toBe(TEST_VALUE);

    container.clearLocal();
    const global2 = container.get(TestGlobalClass);
    const local2 = container.get(TestLocalClass);

    expect(global1).toBe(global2);
    expect(local1).not.toBe(local2);
    expect(local2).toBeInstanceOf(TestLocalClass);
  });
});
