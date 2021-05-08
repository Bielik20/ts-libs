export type IdleResult = [status: 'idle', value: null, error: null];
export type PendingResult = [status: 'pending', value: null, error: null];
export type SuccessResult<T> = [status: 'success', value: T, error: null];
export type ErrorResult = [status: 'error', value: null, error: Error];

export const IDLE_RESULT: IdleResult = ['idle', null, null];
export const PENDING_RESULT: PendingResult = ['pending', null, null];

export function makeSuccessResult<T>(value: T): SuccessResult<T> {
  return ['success', value, null];
}

export function makeErrorResult(error: Error): ErrorResult {
  return ['error', null, error];
}
