import 'reflect-metadata';
import { Container, Injectable } from '@ns3/di';

@Injectable()
class TestClass {}

@Injectable({ autobind: true })
class TestTrueClass {}

@Injectable({ autobind: false })
class TestFalseClass {}

class TestUndecoratedClass {}

@Injectable()
class TestClassWithAnyDep {
  constructor(readonly dep: any) {}
}

describe('Injectable - autobind', () => {
  it('should autobind if config is not specified', () => {
    const container = Container.make();
    const instance = container.get(TestClass);

    expect(instance).toBeInstanceOf(TestClass);
  });

  it('should autobind if config is specified', () => {
    const container = Container.make({ autobind: true });
    const instance = container.get(TestClass);

    expect(instance).toBeInstanceOf(TestClass);
  });

  it('should not autobind if config is specified', () => {
    const container = Container.make({ autobind: false });

    expect(() => container.get(TestClass)).toThrow('is not bound to anything.');
  });

  it('should not autobind if specified in decorator', () => {
    const container = Container.make({ autobind: true });

    expect(() => container.get(TestFalseClass)).toThrow('is not bound to anything.');
  });

  it('should autobind if specified in decorator', () => {
    const container = Container.make({ autobind: false });
    const instance = container.get(TestTrueClass);

    expect(instance).toBeInstanceOf(TestTrueClass);
  });

  it('should not autobind undecorated class', () => {
    const container = Container.make({ autobind: true });

    expect(() => container.get(TestUndecoratedClass)).toThrow('is not bound to anything.');
  });
});
