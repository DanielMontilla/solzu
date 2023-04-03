export type IntervalRange = { min: number, max: number };

/**
 * Check if the given interval range is valid.
 * @param {IntervalRange} range - The range to check.
 * @returns {boolean} Whether the range is valid.
 * 
 * @author Daniel Montilla
 */
export function validRange({ min, max }: IntervalRange): boolean {
  return min <= max;
}

/**
 * Map a value from one interval range to another.
 * @param {number} value - The value to map.
 * @param {IntervalRange} from - The interval range to map from.
 * @param {IntervalRange} to - The interval range to map to.
 * @returns {number} The mapped value.
 * @throws Will throw an error if the value is outside the `from` range, or if either range is invalid.
 * 
 * @author Daniel Montilla
 */
export function safeMapValue(value: number, from: IntervalRange, to: IntervalRange): number {
  if (!(value >= from.min && value <= from.max)) throw Error('value outside of `from` range');
  if (!validRange(from)) throw Error('invalid `from` range');
  if (!validRange(to)) throw Error('invalid `to` range');
  return mapValue(value, from, to);
}

/**
 * Calculate the mapping of a value from one interval range to another.
 * @param {number} value - The value to map.
 * @param {IntervalRange} from - The interval range to map from.
 * @param {IntervalRange} to - The interval range to map to.
 * @returns {number} The calculated mapping.
 * 
 * @author Daniel Montilla
 */
export function mapValue(value: number, from: IntervalRange, to: IntervalRange): number {
  return to.min + (((value - from.min) * (to.max - to.min)) / (from.max - from.min));
}

/**
 * Check whether a given number is a float or an integer.
 * @param {number} n - The number to check.
 * @returns {boolean} True if the number is a float, false if it is an integer.
 * 
 * @author Daniel Montilla
 */
export function isFloat(n: number): boolean {
  return Number(n) === n && n % 1 !== 0;
}

/**
 * Check whether a given number is an integer.
 * @param {number} n - The number to check.
 * @returns {boolean} True if the number is an integer, false if it is a float.
 * 
 * @author Daniel Montilla
 */
export function isInt(n: number): boolean {
  return Number(n) === n && !isFloat(n);
}

/**
 * Generate a random float value within the given interval range.
 * @param {IntervalRange} [range={ min: 0, max: 0 }] - The interval range to generate the random float value within.
 * @returns {number} The random float value within the given interval range.
 * 
 * @author Daniel Montilla
 */
export function randomFloat(range: IntervalRange = { min: 0, max: 1 }): number {
  return mapValue(Math.random(), { min: 0, max: 1 }, range)
}

/**
 * Generate a random integer value within the given interval range.
 * @param {IntervalRange} [range={ min: 0, max: 0 }] - The interval range to generate the random integer value within.
 * @returns {number} The random integer value within the given interval range.
 * 
 * @author Daniel Montilla
 */
export function randomInt(range: IntervalRange = { min: 0, max: 1 }): number {
  return Math.round(randomFloat(range));
}