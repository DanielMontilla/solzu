/**
 * Returns an array of keys from the provided object.
 *
 * @template T
 * @param {T} obj The object to extract keys from.
 * @returns {(keyof T)[]} An array of keys from the object.
 * 
 * @author Daniel Montilla
 */
export const keys = <T extends {}>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
}

/**
 * Returns an array of values from the provided object.
 *
 * @template T
 * @param {T} obj The object to extract values from.
 * @returns {(T[keyof T])[]} An array of values from the object.
 * 
 * @author Daniel Montilla
 */
export const values = <T extends {}>(obj: T): (T[keyof T])[] => {
  return Object.values(obj) as (T[keyof T])[];
}

/**
 * Returns an array of key-value pairs from the provided object.
 *
 * @template T
 * @param {T} obj - The object to extract key-value pairs from.
 * @returns {[keyof T, T[keyof T]][]} - An array of key-value pairs from the object.
 * 
 * @author Daniel Montilla
 */
export const entries = <T extends {}>(obj: T): [keyof T, T[keyof T]][] => {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

/**
 * Converts an array of key-value pairs into a Record object.
 *
 * @template K
 * @template V
 * @param {[K, V][]} entries - The array of key-value pairs to convert.
 * @returns {Record<K, V>} - The Record object created from the array of key-value pairs.
 * 
 * @author Daniel Montilla
 */
export const toRecord = <K extends string | number | symbol, V>(entries: [K, V][]): Record<K, V> => {
  const record: Record<K, V> = {} as Record<K, V>;
  for (const [key, value] of entries) record[key] = value;
  return record;
}