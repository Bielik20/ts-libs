import 'reflect-metadata';
import { Container, Injectable, Scope } from '@ns3/di';

describe('Special - scope boundary', () => {
  describe('Transient -> Local -> Global', () => {
    @Injectable({ scope: Scope.Global })
    class GlobalClass {}

    @Injectable({ scope: Scope.Local })
    class LocalClass {
      constructor(readonly global: GlobalClass) {}
    }

    @Injectable({ scope: Scope.Transient })
    class TransientClass {
      constructor(readonly local: LocalClass) {}
    }

    test('create instance', () => {
      const container = Container.make();
      const instance = container.get(TransientClass);

      expect(instance).toBeInstanceOf(TransientClass);
    });
  });

  describe('Transient -> Local -> Global -> Local', () => {
    @Injectable({ scope: Scope.Local })
    class Local2Class {}

    @Injectable({ scope: Scope.Global })
    class GlobalClass {
      constructor(readonly local2: Local2Class) {}
    }

    @Injectable({ scope: Scope.Local })
    class LocalClass {
      constructor(readonly global: GlobalClass) {}
    }

    @Injectable({ scope: Scope.Transient })
    class TransientClass {
      constructor(readonly local: LocalClass) {}
    }

    test('throw', () => {
      const container = Container.make();

      expect(() => container.get(TransientClass)).toThrow('Unsatisfied scope boundary');
    });
  });

  describe('Global -> Local', () => {
    @Injectable({ scope: Scope.Local })
    class LocalClass {}

    @Injectable({ scope: Scope.Global })
    class GlobalClass {
      constructor(readonly local: LocalClass) {}
    }

    test('throw', () => {
      const container = Container.make();

      expect(() => container.get(GlobalClass)).toThrow('Unsatisfied scope boundary');
    });
  });

  describe('Global -> Transient', () => {
    @Injectable({ scope: Scope.Transient })
    class TransientClass {}

    @Injectable({ scope: Scope.Global })
    class GlobalClass {
      constructor(readonly transient: TransientClass) {}
    }

    test('throw', () => {
      const container = Container.make();

      expect(() => container.get(GlobalClass)).toThrow('Unsatisfied scope boundary');
    });
  });

  describe('Local -> Transient', () => {
    @Injectable({ scope: Scope.Transient })
    class TransientClass {}

    @Injectable({ scope: Scope.Local })
    class LocalClass {
      constructor(readonly transient: TransientClass) {}
    }

    test('throw', () => {
      const container = Container.make();

      expect(() => container.get(LocalClass)).toThrow('Unsatisfied scope boundary');
    });
  });
});
