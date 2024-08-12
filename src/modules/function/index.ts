import { Func } from "../../types";

/**
 * Type guard for to check if a value is a `Function`.
 *
 * @param maybeFunction The value to check.
 * @returns {boolean} `True` if the value is a function.
 */
export function isFunction(maybeFunction: unknown): maybeFunction is Func {
  return typeof maybeFunction === "function";
}
