/**
 * Checks if the given value is a Map.
 * @param {unknown} x The value to check.
 * @returns {boolean} True if the value is a Map, false otherwise.
 */
export function isMap(x: unknown): x is Map<unknown, unknown> {
  return x instanceof Map;
}

/**
 * Checks if the given map is empty.
 * @param {Map<any, any>} map The map to check.
 * @returns {boolean} True if the map is empty, false otherwise.
 */
export function isEmptyMap(map: Map<any, any>): boolean {
  return map.size === 0;
}

/**
 * Checks if the given map is not empty.
 * @param {Map<any, any>} map The map to check.
 * @returns {boolean} True if the map is not empty, false otherwise.
 */
export function isNotEmptyMap(map: Map<any, any>): boolean {
  return map.size > 0;
}
