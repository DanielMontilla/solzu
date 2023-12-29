/**
 * Checks if the given value is a Set.
 * @param {unknown} x - The value to check.
 * @returns {boolean} True if the value is a Set, false otherwise.
 */
export function isSet(x: unknown): x is Set<unknown> {
  return x instanceof Set;
}

/**
 * Checks if the given set is empty.
 * @param {Set<any>} set - The set to check.
 * @returns {boolean} True if the set is empty, false otherwise.
 */
export function isEmptySet(set: Set<any>): boolean {
  return set.size === 0;
}

/**
 * Checks if the given set is not empty.
 * @param {Set<any>} set - The set to check.
 * @returns {boolean} True if the set is not empty, false otherwise.
 */
export function isNotEmptySet(set: Set<any>): boolean {
  return set.size > 0;
}
