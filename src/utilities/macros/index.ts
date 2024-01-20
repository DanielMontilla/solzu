import { RequiredDeep, ExtractArgs, GenericRecord, isRecord } from "../..";

type Return<T extends GenericRecord | undefined> = RequiredDeep<NonNullable<T>>;

/**
 * @experimental
 * Recursively merges input with required fields, ensuring all required fields are present.
 * This function is experimental and may not handle all edge cases or types correctly.
 *
 * @template T - The type of the input object, extending a generic record or undefined.
 * @param {T} input - The input object to merge with required fields.
 * @param {ExtractArgs<T>} required - An object representing the required fields.
 * @returns {Return<T>} - An object that combines the input with all required fields, deeply.
 * @experimental This function is part of experimental features and its behavior might change.
 *
 * @example
 * type Params = { prop1: number; prop2?: number; };
 * const input: Params = { prop1: 0 };
 * const args = defineArgs(input, { prop2: 0 });
 * // ^? { prop1: number, prop2: number } = Required<Params>;
 */
export function defineArgs<T extends GenericRecord | undefined>(
  input: T,
  required: ExtractArgs<T>
): Return<T> {
  if (!input) return required as Return<T>;

  const args = {} as Return<T>;

  for (const key in input) {
    // @ts-ignore
    args[key] = input[key];
  }

  for (const key in required) {
    if (isRecord(required[key])) {
      args[key] = defineArgs(input[key], required[key]);
      continue;
    }

    if (key in input) continue;

    // @ts-ignore
    args[key] = required[key];
  }

  return args;
}

/**
 * Creates a readonly object representing an enumeration from the provided keys.
 * Each key is mapped to a value that is exactly the same as the key.
 * The provided array must be annotated with `as const` for the macro to correctly type the enum.
 *
 * @template Keys A tuple type of string literals representing the keys of the enumeration.
 * @param {Keys} keys An array of strings representing the keys of the enumeration.
 * @returns {Readonly<{ [K in Keys[number]]: K }>} A readonly object with keys and values equal to the elements of the input array.
 */
export function defineEnum<Keys extends readonly string[]>(
  keys: Keys
): Readonly<{ [K in Keys[number]]: K }>;

/**
 * Creates a readonly object representing an enumeration from the provided keys, each prefixed with a dot separator.
 * Each key is mapped to a value that is the concatenation of the provided prefix, a dot, and the key.
 * The provided array must be annotated with `as const` for the macro to correctly type the enum.
 *
 * @template Keys A tuple type of string literals representing the keys of the enumeration.
 * @template Prefix A string literal representing the prefix to be prepended to each key.
 * @param {Keys} keys An array of strings representing the keys of the enumeration.
 * @param {Prefix} prefix A string to prepend to each key in the enumeration.
 * @returns {Readonly<{ [K in Keys[number]]: `${Prefix}.${K}` }>} A readonly object with keys as the elements of the input array and values as the prefixed keys with a dot separator.
 */
export function defineEnum<
  const Keys extends readonly string[],
  const Prefix extends string,
>(
  keys: Keys,
  prefix: Prefix
): Readonly<{ [K in Keys[number]]: `${Prefix}.${K}` }>;

/**
 * Creates a readonly object representing an enumeration from the provided keys.
 * If a prefix is provided, each key is mapped to a value that is the concatenation of the provided prefix, a dot, and the key.
 * Otherwise, each key is mapped to a value that is exactly the same as the key.
 * The provided array must be annotated with `as const` for the macro to correctly type the enum.
 *
 * @template Keys A tuple type of string literals representing the keys of the enumeration.
 * @template Prefix A string literal representing the optional prefix to be prepended to each key.
 * @param {Keys} keys An array of strings representing the keys of the enumeration.
 * @param {Prefix} [prefix] An optional string to prepend to each key in the enumeration.
 * @returns {Readonly<{ [K in Keys[number]]: K | `${Prefix}.${K}` }>} A readonly object with keys as the elements of the input array and values as either the keys themselves or the prefixed keys with a dot separator, depending on whether a prefix is provided.
 */
export function defineEnum<
  Keys extends readonly string[],
  Prefix extends string,
>(
  keys: Keys,
  prefix?: Prefix
): Readonly<{ [K in Keys[number]]: K | `${Prefix}.${K}` }> {
  return keys.reduce((obj, key) => {
    const value = prefix ? `${prefix}.${key}` : key;
    return { ...obj, [key]: value };
  }, {} as any);
}
