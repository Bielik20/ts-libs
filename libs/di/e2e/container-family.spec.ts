import 'reflect-metadata';
import { Container, Injectable, Scope } from '@ns3/di';

@Injectable({ scope: Scope.Global })
class GlobalClass {}

describe('Container - family', () => {
  test('make the same global within one family', () => {
    const container1 = Container.make();
    const container2 = container1.clone();

    const instance1 = container1.get(GlobalClass);
    const instance2 = container2.get(GlobalClass);

    expect(instance1).toBe(instance2);
  });

  test('make different global in separate families', () => {
    const container1 = Container.make();
    const container2 = Container.make();

    const instance1 = container1.get(GlobalClass);
    const instance2 = container2.get(GlobalClass);

    expect(instance1).not.toBe(instance2);
  });
});
