import type { Container } from './container';
import type { Scope } from './scope';

/**
 * Factory method, that should create the bound instance.
 * @return the instance to be used by the Container
 */
export type Factory<T> = (container: Container, requesterScope: Scope) => T;
