import 'reflect-metadata';
import { Container, Injectable, Scope } from '@ns3/di';

@Injectable()
class TestFooClass {}

@Injectable({ useClass: TestFooClass, scope: Scope.Transient })
class TestBarClass {}

describe('Injectable - priority', () => {
  test('Injectable is ignored when provide is used', () => {
    const container = Container.make();

    container.provide({ token: TestBarClass, useClass: TestBarClass });

    const instance1 = container.get(TestBarClass);
    const instance2 = container.get(TestBarClass);

    expect(instance1).toBeInstanceOf(TestBarClass);
    expect(instance1).toBe(instance2);
  });
});
