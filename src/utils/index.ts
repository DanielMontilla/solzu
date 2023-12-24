import { gt } from "../number";
import { Option } from "../option";

/**
 * Delays execution for a specified amount of time.
 * @param {number} duration - The amount of delay in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the specified delay.
 */
export function delay(duration: number): Promise<void>;
export function delay<T>(duration: number, value: T): Promise<T>;
export function delay<T>(duration: number, value?: T): Promise<T | void> {
  const delay = Option.Some(duration).check(gt(0)).takeWith(`Invalid duration ${duration}`);
  return new Promise(resolve => setTimeout(() => resolve(value), delay));
}
