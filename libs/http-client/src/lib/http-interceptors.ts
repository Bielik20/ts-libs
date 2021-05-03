import { Container, Injectable } from '@wikia/dependency-injection';
import { HttpInterceptor } from './models/http-interceptor';
import { Klass } from './models/klass';

const INTERCEPTORS = Symbol('http interceptors');

type Dependency = Parameters<Container['bind']>[0];

@Injectable()
export class HttpInterceptors {
  static provide(...klasses: Klass<HttpInterceptor>[]): Dependency {
    return { bind: INTERCEPTORS, value: klasses };
  }

  constructor(private container: Container) {}

  get(): HttpInterceptor[] {
    const klasses = this.getInterceptorsClasses();

    return klasses.map((klass) => {
      this.container.bind(klass);

      return this.container.get(klass);
    });
  }

  private getInterceptorsClasses(): Klass<HttpInterceptor>[] {
    try {
      return this.container.get(INTERCEPTORS);
    } catch (e) {
      return [];
    }
  }
}
