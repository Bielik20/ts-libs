import type { Container } from './container';
import type { Scope } from './scope';

/**
 * Factory method, that should create the bind instance.
 * @return the instance to be used by the Container
 */
export type Provider<T> = (container: Container, requesterScope: Scope) => T;
