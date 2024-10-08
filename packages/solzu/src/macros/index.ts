/**
 * Creates a readonly object representing an enumeration from the provided keys.
 * Each key is mapped to a value that is exactly the same as the key
 *
 * @template Keys A tuple type of string literals representing the keys of the enumeration.
 * @param {Keys} keys An array of strings representing the keys of the enumeration.
 * @returns {Readonly<{ [K in Keys[number]]: K }>} A readonly object with keys and values equal to the elements of the input array.
 */
export function defineEnum<const Keys extends readonly string[]>(
  keys: Keys
): Readonly<{ [K in Keys[number]]: K }> {
  return keys.reduce((obj, key) => {
    return { ...obj, [key]: key };
  }, {} as any);
}

export function cast<V>(x: unknown) {
  return x as V;
}
