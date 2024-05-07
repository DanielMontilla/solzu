import { job, OkOf, Result, isNumber } from "../..";
import * as R from "../../primitives/result/scoped";

/**
 * Generates a random floating-point number between 0 (inclusive) and 1 (exclusive).
 * @returns {number} A random floating-point number.
 */
export function nextFloat(): number {
  return Math.random();
}

export namespace nextFloat {
  /**
   * Generates a random floating-point number between the specified minimum and maximum range.
   * @param {number} min - The minimum number in the range.
   * @param {number} max - The maximum number in the range.
   * @returns {Result<number, string>} A Result containing the random number or an error.
   */
  export function between(min: number, max: number): Result<number, string> {
    return job(
      OkOf({ min, max }),
      R.check(({ min }) => isNumber(min), "invalid input"),
      R.check(({ max }) => isNumber(max), "invalid input"),
      R.check(({ min, max }) => min <= max, "invalid range"),
      R.map(({ min, max }) => between.unsafe(min, max))
    );
  }

  export namespace between {
    /**
     * Generates a random floating-point number between the specified minimum and maximum range without validation.
     * This function expects the inputs are valid numbers with `min <= max`. Otherwise might behave in unexpected ways.
     * @param {number} min - The minimum number in the range.
     * @param {number} max - The maximum number in the range.
     * @returns {number} A random floating-point number between min and max.
     */
    export function unsafe(min: number, max: number): number {
      return Math.random() * (max - min) + min;
    }
  }
}
