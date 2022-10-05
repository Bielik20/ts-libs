import 'reflect-metadata';
import { Container, Inject, Injectable } from '@ns3/di';

@Injectable()
class Foo {}

@Injectable()
class Bar {}

@Injectable()
class TestClass {
  constructor(public param1: Bar, @Inject('symbol') public param2: Bar) {}
}

describe('Inject - priority', () => {
  let container: Container;

  beforeEach(() => {
    container = Container.make();

    container.set({ bind: 'symbol', klass: Foo });
  });

  test('Inject overwrites Injectable', () => {
    const instance = container.get(TestClass);

    expect(instance.param1).toBeInstanceOf(Bar);
    expect(instance.param2).toBeInstanceOf(Foo);
  });
});
