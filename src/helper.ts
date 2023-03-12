const _global = (window || global) as any;

export const defineGlobal = <
  Key extends keyof typeof globalThis
>(
  key: Key,
  value: typeof globalThis[Key]
) => _global[key] = value;

export const defineGlobals = <
  Key extends keyof typeof globalThis
>(
  entries: {
    key: Key,
    value: typeof globalThis[Key]
  }[]
) => entries.forEach(({ key, value }) => defineGlobal(key, value));