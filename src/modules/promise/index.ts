import { isFunction } from "../function";

/**
 * Returns a promise that resolves after a specified delay.
 * @param {number} ms - The delay duration in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the specified delay.
 */
export function delay(ms: number): Promise<void>;

/**
 * Returns a promise that resolves with a specified value after a specified delay.
 * @template V
 * @param {number} ms - The delay duration in milliseconds.
 * @param {V} value - The value to be resolved after the delay.
 * @returns {Promise<V>} A promise that resolves with the specified value after the specified delay.
 */
export function delay<V>(ms: number, value: V): Promise<V>;

export function delay<V>(ms: number, value: V | undefined = undefined) {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

/**
 * Ensures that a given promise takes at least a specified duration to resolve.
 * @template T - The type of the promise result.
 * @param {import("../../types").Procedure<Promise<T>>} fn - A function that returns a promise.
 * @param {number} duration - The minimum delay duration in milliseconds.
 * @returns {Promise<T>} A promise that resolves to the result of the given promise,
 * but only after at least the specified delay duration.
 */
export async function enforceDelay<T>(
  fn: () => Promise<T>,
  duration: number
): Promise<T> {
  const [result] = await Promise.all([fn(), delay(duration)]);
  return result;
}

/**
 * Type guard to check if a value is a `Promise`.
 *
 * @param maybePromise The value to check.
 * @returns {boolean} `True` if the value is a Promise.
 */
export function isPromise(maybePromise: unknown): maybePromise is Promise<any> {
  return (
    maybePromise instanceof Promise ||
    (maybePromise !== null &&
      typeof maybePromise === "object" &&
      "then" in maybePromise &&
      isFunction(maybePromise.then) &&
      "catch" in maybePromise &&
      isFunction(maybePromise.catch))
  );
}
