import 'reflect-metadata';
import { Container, Injectable, Scope } from '@ns3/di';

@Injectable()
class Foo {}

@Injectable()
class Bar {}

describe('Container - clone', () => {
  test('copy local bindings without instances', () => {
    const containerA1 = Container.make();
    const containerB1 = containerA1.clone();

    containerB1.provide({ bind: Foo, klass: Bar });

    const containerA2 = containerA1.clone();
    const containerB2 = containerB1.clone();

    const instanceA1 = containerA1.get(Foo);
    const instanceA2 = containerA2.get(Foo);
    const instanceB1 = containerB1.get(Foo);
    const instanceB2 = containerB2.get(Foo);

    expect(instanceA1).toBeInstanceOf(Foo);
    expect(instanceA2).toBeInstanceOf(Foo);
    expect(instanceA1).not.toBe(instanceA2);
    expect(instanceB1).toBeInstanceOf(Bar);
    expect(instanceB2).toBeInstanceOf(Bar);
    expect(instanceB1).not.toBe(instanceB2);
  });

  test('global binding is always shared', () => {
    const container1 = Container.make();
    const container2 = container1.clone();

    container2.provide({ bind: Foo, klass: Foo, scope: Scope.Global });

    const instance1 = container1.get(Foo);
    const instance2 = container2.get(Foo);

    expect(instance1).toBe(instance2);
  });
});
