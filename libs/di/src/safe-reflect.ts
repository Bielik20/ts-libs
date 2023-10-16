/* eslint-disable @typescript-eslint/no-empty-function */
export const SafeReflect = makeSafeReflect();
export type SafeReflect = Pick<typeof Reflect, 'getMetadata' | 'hasOwnMetadata' | 'defineMetadata'>;

function makeSafeReflect(): SafeReflect {
  if ('getMetadata' in Reflect) {
    return Reflect;
  } else {
    return {
      getMetadata: (metadataKey: any, target: Object) => {
        return (target as any)[metadataKey];
      },
      hasOwnMetadata: (metadataKey: any, target: Object) => {
        return metadataKey in target;
      },
      defineMetadata: (metadataKey: any, metadataValue: any, target: Object) => {
        (target as any)[metadataKey] = metadataValue;
      },
    };
  }
}
