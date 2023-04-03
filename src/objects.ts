export function defineOptions<O extends Object>(
  partialOptions: Partial<O> | undefined,
  defaultOptions: O
): O {
  if (!partialOptions) return defaultOptions;
  let res: O = {...partialOptions} as O;
  for (const key in defaultOptions) {
    if (Object.prototype.hasOwnProperty.call(defaultOptions, key)) {
      const objectKey = key as keyof O;
      if (!(objectKey in partialOptions)) res[objectKey] = defaultOptions[key];
    }
  } 
  return res;
}