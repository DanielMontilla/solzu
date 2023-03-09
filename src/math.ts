export {};
const _global = window || global;
declare global {
  interface IntervalRange {
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
  function mapValue(value: number, from: IntervalRange, to: IntervalRange): number;

  /**
   * @param {IntervalRange} range
   * @returns {number} random number in range
   */
  function randFloat(range?: IntervalRange): number;
}


const mapValue: typeof globalThis.mapValue = (
  value: number,
  { min: a1, max: a2 }: IntervalRange,
  { min: b1, max: b2 }: IntervalRange
) => b1 + (((value - a1)*(b2 - b1)) / (a2 - a1));
_global.mapValue = mapValue;

const randFloat: typeof globalThis.randFloat = (
  range: IntervalRange = { min: 0, max: 1 }
) => mapValue(Math.random(), { min: 0, max: 1 }, range);
_global.randFloat = randFloat;