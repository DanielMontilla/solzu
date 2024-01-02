import type { Entries, RecordKey } from "../..";

/**
 * Returns an array of keys from the provided object.
 *
 * @template T
 * @param {T} obj The object to extract keys from.
 * @returns {(keyof T)[]} An array of keys from the object.
 */
export const keysOf = <T extends Object>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
};

/**
 * Returns an array of values from the provided object.
 *
 * @template T
 * @param {T} obj The object to extract values from.
 * @returns {(T[keyof T])[]} An array of values from the object.
 */
export const valuesOf = <T extends Object>(obj: T): T[keyof T][] => {
  return Object.values(obj) as T[keyof T][];
};

/**
 * Returns an array of key-value pairs from the provided object.
 *
 * @template T
 * @param {T} obj - The object to extract key-value pairs from.
 * @returns {[keyof T, T[keyof T]][]} - An array of key-value pairs from the object.
 */
export const entriesOf = <T extends Object>(
  obj: T
): [keyof T, T[keyof T]][] => {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
};

/**
 * Converts an array of key-value pairs into a Record object.
 *
 * @template K - The type of the keys in the record.
 * @template V - The type of the values in the record.
 * @param {Entries<K, V>} entries - The array of key-value pairs to convert.
 * @returns {Record<K, V>} - The Record object created from the array of key-value pairs.
 */
export const recordFromEntries = <K extends RecordKey, V>(
  entries: Entries<K, V>
): Record<K, V> => {
  const record = {} as Record<K, V>;
  for (const [key, value] of entries) record[key] = value;
  return record;
};

/**
 * Converts a Map into a Record object.
 *
 * @template K - The type of the keys in the map and resulting record.
 * @template V - The type of the values in the map and resulting record.
 * @param {Map<K, V>} map - The map to convert into a record.
 * @returns {Record<K, V>} - The Record object created from the map.
 */
export const recordFromMap = <K extends RecordKey, V>(
  map: Map<K, V>
): Record<K, V> => {
  const record = {} as Record<K, V>;
  for (const [key, value] of map) record[key] = value;
  return record;
};

/**
 * Converts an array of values into a Record object with indices as keys.
 *
 * @template V - The type of the values in the array.
 * @param {Array<V>} array - The array of values to convert.
 * @returns {Record<number, V>} - The Record object created from the array, with indices as keys.
 */
export const recordFromArray = <V>(array: Array<V>): Record<number, V> => {
  const record = {} as Record<number, V>;
  for (let index = 0; index < array.length; index++)
    record[index] = array[index];
  return record;
};

/**
 * Converts a Set of values into a Record object with sequential indices as keys.
 *
 * @template V - The type of the values in the set.
 * @param {Set<V>} set - The set of values to convert.
 * @returns {Record<number, V>} - The Record object created from the set, with sequential indices as keys.
 */
export const recordFromSet = <V>(set: Set<V>): Record<number, V> => {
  const record = {} as Record<number, V>;
  let index = 0;
  for (const value of set) {
    record[index++] = value;
  }
  return record;
};

export function recordFrom<K extends RecordKey, V>(
  entries: Entries<K, V>
): Record<K, V>;
export function recordFrom<K extends RecordKey, V>(
  map: Map<K, V>
): Record<K, V>;
export function recordFrom<V>(set: Set<V>): Record<number, V>;
export function recordFrom<K extends RecordKey, V>(
  collection: Entries<K, V> | Map<K, V> | Set<V>
): Record<K, V> | Record<number, V> {
  if (collection instanceof Map) return recordFromMap(collection);
  if (collection instanceof Set) return recordFromSet(collection);
  return recordFromEntries(collection);
}

/**
 * Check if a key exists in an object.
 *
 * @param {Object} obj - The object to check within.
 * @param {string | number | symbol} key - The key to check for.
 * @returns {boolean} True if the key exists in the object, otherwise false.
 */
export const hasProperty = <K extends Object>(
  obj: K,
  key: RecordKey
): key is keyof K => {
  return Object.hasOwn(obj, key);
};

/**
 * Checks if the provided value is a record (an object with string keys and any type of values).
 * Specifically, it verifies that the value is an object, not null, not an array, and not a class instance.
 *
 * @param value The value to check.
 * @returns {boolean} -true` if the value is a record, otherwise `false`.
 */
export function isRecord(value: any): value is Record<RecordKey, any> {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  if (Array.isArray(value)) {
    return false;
  }
  if (Object.getPrototypeOf(value) !== Object.prototype) {
    return false;
  }
  return true;
}
