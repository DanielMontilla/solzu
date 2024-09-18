export function isObject(value: unknown): value is Object {
  return typeof value === "object" && value !== null;
}

export function hasKey<K extends PropertyKey>(obj: object, key: K): key is keyof typeof obj {
  return key in obj;
}
