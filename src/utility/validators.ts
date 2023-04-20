export function isKey<T extends {}>(key: string | symbol | number, object: T): key is keyof T {
  return key in object;
}