declare interface IntervalRange {
  min: number,
  max: number
}
/**
 * @copyright https://rosettacode.org/wiki/Map_range
 * @param {number} value - value to be mapped 
 * @param {IntervalRange} from - source range `value` must be in this range
 * @param {IntervalRange} to - destination range
 * @returns {number} mapped value to ""`to`" range
 */
declare function mapValue(value: number, from: IntervalRange, to: IntervalRange): number;

/**
 * @param {IntervalRange} range
 * @returns {number} random number in range
 */
declare function randomFloat(range?: IntervalRange): number;