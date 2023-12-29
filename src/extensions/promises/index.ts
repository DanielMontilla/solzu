/**
 * Delays execution for a specified amount of time and then resolves or rejects a promise.
 *
 * @template T The type of the value for resolution.
 * @param {number} duration The amount of time in milliseconds to delay.
 * @param {object} config Configuration object specifying the mode and optional value.
 * @param {"resolve" | "reject"} config.mode - Determines whether the promise should resolve or reject after the delay.
 * @param {T} [config.value] The value with which the promise will resolve if mode is "resolve".
 * @returns {Promise<T | void>} A promise that resolves with the provided value after the specified duration if mode is "resolve", or rejects if mode is "reject".
 * @throws {Error} Throws an error if the duration is not a positive number.
 *
 * The function supports different behaviors based on the provided configuration:
 * - If mode is "resolve" and value is provided, the promise resolves with the value after the delay.
 * - If mode is "resolve" and no value is provided, the promise resolves with undefined after the delay.
 * - If mode is "reject", the promise rejects with an error after the delay.
 */
export function delay(duration: number): Promise<void>;
export function delay(
  duration: number,
  config: { mode: "resolve" }
): Promise<void>;
export function delay<T>(
  duration: number,
  config: { mode: "resolve"; value: T }
): Promise<T>;
export function delay<T = void>(
  duration: number,
  config: { mode: "reject" }
): Promise<T>;
export function delay<T>(
  duration: number,
  config: { mode: "resolve" | "reject"; value?: T } = { mode: "resolve" }
): Promise<T | void> {
  if (duration <= 0 || isNaN(duration))
    throw Error(`Invalid duration ${duration}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (config.mode === "resolve") {
        resolve(config.value);
      } else if (config.mode === "reject") {
        reject(new Error("Rejected by delay function"));
      }
    }, duration);
  });
}
