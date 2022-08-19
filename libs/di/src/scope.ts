export const enum Scope {
  Global,
  Local,
  Transient,
}

/**
 * Global can be requested by Global.
 * Global and Local can be requested by Local.
 * Global and Local and Transient can be requested by Transient.
 */
export function assertScopeBoundary(requestee: Scope, requester: Scope): void {
  const correct = requester >= requestee;

  if (!correct) {
    throw new Error('Unsatisfied scope boundary');
  }
}
