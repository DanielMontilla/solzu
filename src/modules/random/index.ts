import { job, OkOf, Result, isNumber, isInt } from "../..";
import { defineEnum } from "../macros";
import * as R from "../../primitives/result/scoped";

/**
 * Generates a random floating-point number between 0 (inclusive) and 1 (exclusive).
 * @returns {number} A random floating-point number.
 */
export function nextFloat(): number {
  return Math.random();
}

export module nextFloat {
  /**
   * Generates a random floating-point number between the specified minimum and maximum range
   * @param {number} min minimum number in the range. Must be integer
   * @param {number} max maximum number in the range. Must be integer
   * @returns {Result<number, between.Error>} `Result` containing the random integer or an error
   */
  export function between(
    min: number,
    max: number
  ): Result<number, between.Error> {
    return job(
      OkOf({ min, max }),
      R.check(({ min }) => isNumber(min), between.Error.InvalidInput),
      R.check(({ max }) => isNumber(max), between.Error.InvalidInput),
      R.check(({ min, max }) => min <= max, between.Error.InvalidRange),
      R.map(({ min, max }) => between.unsafe(min, max))
    );
  }

  export module between {
    export type Error = (typeof Error)[keyof typeof Error];
    export const Error = defineEnum(["InvalidRange", "InvalidInput"] as const);

    /**
     * Generates a random integer number between the specified minimum and maximum range
     * This function expects the inputs are valid numbers with `min <= max`. Otherwise might behave in unexpected ways
     * @param {number} min minimum number in the range. Less than or equal to `max`
     * @param {number} max maximum number in the range. More than or equal to `min`
     * @returns {number} random floating-point number between min and max
     */
    export function unsafe(min: number, max: number): number {
      return Math.random() * (max - min) + min;
    }
  }
}

/**
 * Generates a random integer 0 or 1.
 * @returns {0 | 1} `1` or `0`
 */
export function nextInt(): 0 | 1 {
  return Math.floor(Math.random() * 2) as 0 | 1;
}

export module nextInt {
  /**
   * Generates a random integer between the specified minimum and maximum range (inclusive) without validation
   * This function expects the inputs are valid numbers with `min <= max`. Otherwise might behave in unexpected ways.
   * @param {number} min minimum number in the range (inclusive).
   * @param {number} max maximum number in the range (inclusive).
   * @returns {number} random integer between min and max (inclusive).
   */
  export function between(
    min: number,
    max: number
  ): Result<number, between.Error> {
    return job(
      OkOf({ min, max }),
      R.check(({ min }) => isNumber(min), between.Error.InvalidInput),
      R.check(({ min }) => isInt(min), between.Error.InvalidInput),
      R.check(({ max }) => isNumber(max), between.Error.InvalidInput),
      R.check(({ max }) => isInt(max), between.Error.InvalidInput),
      R.check(({ min, max }) => min <= max, between.Error.InvalidRange),
      R.map(({ min, max }) => between.unsafe(min, max))
    );
  }

  export module between {
    export type Error = (typeof Error)[keyof typeof Error];
    export const Error = defineEnum(["InvalidRange", "InvalidInput"] as const);

    /**
     * Generates a random integer between the specified minimum and maximum range (inclusive) without validation
     * This function expects the inputs are valid numbers with `min <= max`. Otherwise might behave in unexpected ways.
     * @param {number} min minimum number in the range (inclusive).
     * @param {number} max maximum number in the range (inclusive).
     * @returns {number} random integer between min and max (inclusive).
     */
    export function unsafe(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }
}
