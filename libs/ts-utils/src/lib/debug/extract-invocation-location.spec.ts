import { extractInvocationLocation } from './extract-invocation-location';

describe('extractInvocationLocation', () => {
  it('should print file of origin with depth 0', () => {
    expect(extractInvocationLocation({ depth: 0 })).toEqual('extract-invocation-location.ts:11:17');
  });

  it('should print this file with depth 1', () => {
    expect(extractInvocationLocation({ depth: 1 })).toEqual(
      'extract-invocation-location.spec.ts:9:37',
    );
  });
});
