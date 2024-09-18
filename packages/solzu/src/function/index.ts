import { Callable } from "../types";

/**
 * Type guard for to check if a value is a `Function`.
 *
 * @param thing The value to check.
 * @returns {boolean} `True` if the value is a function.
 */
export function isFunction(thing: unknown): thing is Callable {
  return typeof thing === "function";
}
