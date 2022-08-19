import 'reflect-metadata';
import { Container, Injectable } from '@ns3/di';

describe('Optional', () => {
  describe('when TestClassWithAnyDep', () => {
    @Injectable()
    class TestClassWithAnyDep {
      constructor(readonly dep: any) {}
    }

    test('throw', () => {
      const container = Container.make();

      expect(() => container.get(TestClassWithAnyDep)).toThrow(
        'function Object() { [native code] } is not bound to anything.',
      );
    });
  });
});
