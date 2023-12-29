/**
 * Checks if the given value is an array.
 * @param {unknown} x The value to check.
 * @returns {boolean} True if the value is an array, false otherwise.
 */
export function isArray(x: unknown): x is Array<unknown> {
  return Array.isArray(x);
}

/**
 * Checks if the given array is empty.
 * @param {Array<any>} array The array to check.
 * @returns {boolean} True if the array is empty, false otherwise.
 */
export function isEmptyArray(array: Array<any>) {
  return array.length === 0;
}

/**
 * Checks if the given array is not empty.
 * @param {Array<any>} array The array to check.
 * @returns {boolean} True if the array is not empty, false otherwise.
 */
export function isNotEmptyArray(array: Array<any>): boolean {
  return array.length > 0;
}
