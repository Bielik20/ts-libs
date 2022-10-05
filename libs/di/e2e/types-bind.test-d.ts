import 'reflect-metadata';
import { Container } from '@ns3/di';
import { expectError } from 'tsd';

class BaseClass {
  private constructor(private field: any) {}

  method() {
    return 'method';
  }

  private hidden() {
    return 'hidden';
  }
}

class CorrectClass {
  method() {
    return 'method';
  }
}
const CORRECT_INSTANCE = {
  method: () => 'method',
};

const CORRECT_PROVIDER = () => CORRECT_INSTANCE;

class WrongClass {
  wrong() {
    return 'wrong';
  }
}

const WRONG_INSTANCE = {
  wrong: () => 'wrong',
};

const WRONG_PROVIDER = () => WRONG_INSTANCE;

const container = Container.make();

container.set({ bind: BaseClass, klass: CorrectClass });
container.set({ bind: BaseClass, value: CORRECT_INSTANCE });
container.set({ bind: BaseClass, provider: CORRECT_PROVIDER });

expectError(container.set({ bind: BaseClass, klass: WrongClass }));
// tsd doesn't interpret that line correctly... I don't know why.
// expectError(container.set({ bind: BaseClass, value: WRONG_INSTANCE }));
expectError(container.set({ bind: BaseClass, provider: WRONG_PROVIDER }));
