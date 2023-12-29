import { RequiredDeep, ExtractArgs, GenericRecord, isRecord } from "../..";

type Return<T extends GenericRecord | undefined> = RequiredDeep<NonNullable<T>>;

/**
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
