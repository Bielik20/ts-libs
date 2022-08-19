import 'reflect-metadata';
import { Container, Injectable, Scope } from '@ns3/di';

@Injectable()
class TestFooClass {}

@Injectable({ klass: TestFooClass, scope: Scope.Transient })
class TestBarClass {}

describe('Injectable - priority', () => {
  test('Injectable is ignored when bind is used', () => {
    const container = Container.make();

    container.bind({ bind: TestBarClass, klass: TestBarClass });

    const instance1 = container.get(TestBarClass);
    const instance2 = container.get(TestBarClass);

    expect(instance1).toBeInstanceOf(TestBarClass);
    expect(instance1).toBe(instance2);
  });
});
