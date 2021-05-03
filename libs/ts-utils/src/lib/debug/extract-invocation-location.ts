type Options = {
  depth: number;
};

/**
 * Uses stack trace to extract location of invocation.
 * You need to provide correct depth to get expected result.
 * Running with depth 0 will always return this file.
 */
export function extractInvocationLocation({ depth }: Options): string {
  const error = new Error();
  const stack = error.stack || '';
  const baseDepth = 1; // first line is always Error
  const line = stack.split('\n')[depth + baseDepth] || '';
  const match = line.match(/([^/]*?)\)/);

  if (match) {
    return match[1];
  }

  return '';
}
