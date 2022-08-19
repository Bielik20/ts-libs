import 'reflect-metadata';
import { Container, Injectable } from '@ns3/di';

@Injectable()
class FooClass {
  constructor(readonly container: Container) {}
}

@Injectable()
class BarClass {
  constructor(readonly container: Container) {}
}

describe('Container - inject self', () => {
  test('inject different container to different scope', () => {
    const container1 = Container.make();
    const container2 = container1.clone();

    const instance1 = container1.get(FooClass);
    const instance2 = container2.get(FooClass);

    expect(instance1.container).not.toBe(instance2.container);
    expect(instance1.container).toBe(container1);
    expect(instance2.container).toBe(container2);
  });

  test('inject the same container to the same scope', () => {
    const container1 = Container.make();

    const instance1 = container1.get(FooClass);
    const instance2 = container1.get(BarClass);

    expect(instance1.container).toBe(instance2.container);
  });
});
