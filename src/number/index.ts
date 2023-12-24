import type { Predicate } from "../types/index";
import { Option } from "../option";
import { isString } from "../string";

/**
 * Checks if the value is a number and not NaN.
 * @param x - The value to check.
 * @returns `true` if x is a number and not NaN, `false` otherwise.
 */
export const isNumber: Predicate<any, number> = (x: any): x is number =>
  typeof x === "number" && !Number.isNaN(x);

/**
 * Checks if the value is an integer and not NaN.
 * @param x - The number to check.
 * @returns `true` if x is an integer and not NaN, `false` otherwise.
 */
export const isInt = ((x: number) =>
  Number.isInteger(x) && !Number.isNaN(x)) satisfies Predicate<number>;

/**
 * Checks if the value is a floating-point number and not NaN.
 * @param x - The number to check.
 * @returns `true` if x is a float and not NaN, `false` otherwise.
 */
export const isFloat = ((x: number) =>
  Number.isFinite(x) && !Number.isInteger(x) && !Number.isNaN(x)) satisfies Predicate<number>;

/**
 * Checks if the number is greater than the specified value.
 * @param value - The value to compare against.
 * @returns A function that takes a number and returns `true` if it is greater than the specified value, `false` otherwise.
 * @example
 * gt(5)(10) // true, because 10 > 5
 * gt(5)(5) // false, because 5 is not greater than 5
 */
export const gt =
  (value: number): Predicate<number> =>
  (x: number) =>
    x > value;

/**
 * Checks if the number is greater than or equal to the specified value.
 * @param value - The value to compare against.
 * @returns A function that takes a number and returns `true` if it is greater than or equal to the specified value, `false` otherwise.
 * @example
 * gte(5)(5) // true, because 5 is equal to 5
 * gte(5)(4) // false, because 4 is not greater than or equal to 5
 */
export const gte =
  (value: number): Predicate<number> =>
  (x: number) =>
    x >= value;

/**
 * Checks if the number is less than the specified value.
 * @param value - The value to compare against.
 * @returns A function that takes a number and returns `true` if it is less than the specified value, `false` otherwise.
 * @example
 * lt(3)(2) // true, because 2 < 3
 * lt(3)(3) // false, because 3 is not less than 3
 */
export const lt =
  (value: number): Predicate<number> =>
  (x: number) =>
    x < value;

/**
 * Checks if the number is less than or equal to the specified value.
 * @param value - The value to compare against.
 * @returns A function that takes a number and returns `true` if it is less than or equal to the specified value, `false` otherwise.
 * @example
 * lte(0)(-1) // true, because -1 is less than 0
 * lte(0)(1) // false, because 1 is not less than or equal to 0
 */
export const lte =
  (value: number): Predicate<number> =>
  (x: number) =>
    x <= value;

/**
 * Checks if a number is positive. Zero is not positive.
 * @param x - The number to check.
 * @returns `true` if x is positive, `false` otherwise.
 */
export const isPositive: Predicate<number> = (x: number) => x > 0;

/**
 * Checks if a number is negative. Zero is not negative.
 * @param x - The number to check.
 * @returns `true` if x is negative, `false` otherwise.
 */
export const isNegative: Predicate<number> = (x: number) => x < 0;

/**
 * Checks if a number is non-negative (zero or positive).
 * @param x - The number to check.
 * @returns `true` if x is non-negative, `false` otherwise.
 */
export const isNonNegative: Predicate<number> = (x: number) => x >= 0;

/**
 * Checks if a number is non-positive (zero or negative).
 * @param x - The number to check.
 * @returns `true` if x is non-positive, `false` otherwise.
 */
export const isNonPositive: Predicate<number> = (x: number) => x <= 0;

/** TODO: docs + make into result */
export const tryParseNumber = (value: any): Option<number> => {
  return Option.Pure(value).compose(
    num => num.check(isNumber),
    str =>
      str
        .check(isString)
        .transform(x => x.trim())
        .compose(
          x => x.transform(x => Number.parseFloat(x)).check(isNumber),
          x => x.transform(x => Number.parseInt(x)).check(isNumber)
        )
        .check(isNumber)
  );
};
