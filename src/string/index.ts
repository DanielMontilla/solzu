import { Predicate } from "../types/index";

/**
 * Checks if the value is a string
 * @param x - The value to check.
 * @returns `true` if x is a string, `false` otherwise.
 */
export const isString: Predicate<any, string> = (x: any): x is string =>
  typeof x === "string";
