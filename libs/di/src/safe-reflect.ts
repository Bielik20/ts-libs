/* eslint-disable @typescript-eslint/no-empty-function */
export const SafeReflect = makeSafeReflect();
export type SafeReflect = Pick<typeof Reflect, 'getMetadata' | 'hasOwnMetadata' | 'defineMetadata'>;

function makeSafeReflect(): SafeReflect {
  if ('getMetadata' in Reflect) {
    return Reflect;
  } else {
    return {
      getMetadata: () => {},
      hasOwnMetadata: () => false,
      defineMetadata: () => {},
    };
  }
}
