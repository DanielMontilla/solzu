import { Result, RESULT_MAX_UNFOLD_DEPTH, ResultFromTryCatch } from ".";
import type { Operator } from "../../types";
import * as R from "./mod";
import type { TakeError } from "./mod";

/**
 * Alias for `Result.Flatten`. Reduces the nesting depth of a `Result` by one level.
 * @template R The input `Result` type.
 * @returns The flattened `Result`.
 * @see {@link Result.Flatten}
 */
export type Flatten<R extends Result.Any> = Result.Flatten<R>;

/**
 * Alias for `Result.Unfold`. Unfolds a nested `Result` up to a specified limit.
 * @template R The input `Result` type.
 * @template Limit The maximum depth for unfolding. Defaults to `RESULT_MAX_UNFOLD_DEPTH`.
 * @returns The unfolded `Result`.
 * @see {@link Result.Unfold}
 */
export type Unfold<
  R extends Result.Any,
  Limit extends number = typeof RESULT_MAX_UNFOLD_DEPTH,
> = Result.Unfold<R, Limit>;

/**
 * Alias re-export for `ResultFromTryCatch`.
 * @see {@link ResultFromTryCatch}
 */
export const FromTryCatch = ResultFromTryCatch;

/**
 * Creates an operator that extracts the `Ok` value from a `Result`, or throws `TakeError` if it is `Err`.
 * @template V The type of the `Ok` value.
 * @returns An operator that either returns the `Ok` value or throws an error.
 * @throws {TakeError} if the result is not an `Ok`.
 * @see {@link TakeError}
 * @see {@link or}
 */
export function take<V>(): Operator<Result<V, any>, V> {
  return result => R.take(result);
}

/**
 * Creates an operator that applies a function to the `Ok` value of a `Result`, if present.
 * @template V The type of the `Ok` value.
 * @template E The type of the `Err` error.
 * @param {Operator<V, any>} f A function to apply to the `Ok` value.
 * @returns An operator that returns the same `Result`.
 */
export function peek<V, E>(
  f: (ok: V) => any
): Operator<Result<V, E>, Result<V, E>> {
  return result => R.peek(result, f);
}

/**
 * Creates an operator that applies a function to the `Err` value of a `Result`, if present.
 * @template V The type of the `Ok` value.
 * @template E The type of the `Err` error.
 * @param {Operator<E, any>} f A function to apply to the `Err` value.
 * @returns An operator that returns the same `Result`.
 */
export function peekErr<V, E>(
  f: (err: E) => any
): Operator<Result<V, E>, Result<V, E>> {
  return result => R.peekErr(result, f);
}

/**
 * Creates an operator that transforms the `Ok` value of a `Result` using a provided mapping function, or returns the same `Err`.
 * @template From The type of the `Ok` value before the transformation.
 * @template To The type of the `Ok` value after the transformation.
 * @template E The type of the `Err` error.
 * @param {import("../../types").Mapper<From, To>} mapper A function to transform the `Ok` value.
 * @returns An operator that returns a new `Result` with the transformed `Ok` value or the same `Err`.
 */
export function map<From, E, To>(
  mapper: (ok: From) => To
): Operator<Result<From, E>, Result<To, E>> {
  return result => R.map(result, mapper);
}

/**
 * Creates an operator that transforms the `Err` value of a `Result` using a provided mapping function, or returns the unchanged `Ok`.
 * @template V The type of the `Ok` value.
 * @template From The original error type.
 * @template To The new error type.
 * @param {import("../../types").Mapper<From, To>} mapper A function to transform the error.
 * @returns An operator that returns a new `Result` with the transformed error or the unchanged `Ok`.
 */
export function mapErr<V, From, To>(
  mapper: (error: From) => To
): Operator<Result<V, From>, Result<V, To>> {
  return result => R.mapErr(result, mapper);
}

/**
 * Creates an operator that returns an alternative value or executes a function if the input `Result` is an instance of `Err`.
 * @template V The type of the `Ok` value.
 * @template E The type of the `Err` error.
 * @param {import("../../types").Mapper<E, V>} f A function that receives an `Err` error and returns an alternative value.
 * @returns An operator that returns either the `Ok` value or an alternative value.
 */
export function or<V, E>(f: (error: E) => V): Operator<Result<V, E>, V>;

/**
 * Creates an operator that returns a specified value if the input `Result` is an instance of `Err`.
 * @template V The type of the `Ok` value.
 * @param {V} value The alternative value to return.
 * @returns An operator that returns either the `Ok` value or the specified alternative value.
 */
export function or<V>(value: V): Operator<Result<V, any>, V>;

/**
 * @internal
 */
export function or<V, E>(
  fOrValue: ((error: E) => V) | V
): Operator<Result<V, E>, V> {
  // @ts-ignore
  return (result: Result<V, E>): V => R.or(result, fOrValue);
}

/**
 * Turns a nested Result into a result of depth 1. This is for the Ok channel only. Input result should never exceed a depth of `MAX_UNFOLD_DEPTH`.
 * @template V inner Ok value type
 * @template E inner Err error type
 * @returns An operator that takes a nested result and returns an unfolded result.
 * @see {@link RESULT_MAX_UNFOLD_DEPTH}
 */
export function unfold<V, E>(): Operator<Result<V, E>, Unfold<Result<V, E>>> {
  return result => R.unfold(result);
}

/**
 * Turns a nested `Result` into a result with 1 less depth. This unnesting occurs for the Ok channel.
 * @template V inner Ok value type
 * @template E inner Err error type
 * @returns An operator that takes a nested result and returns a flattened result.
 */
export function flatten<V, E>(): Operator<Result<V, E>, Flatten<Result<V, E>>> {
  return result => R.flatten(result);
}

/**
 * Transforms & unwraps an input `Result`. Used when you'd like to generate an error based on the inner Ok value of the result, if there is one.
 * @template FromValue original Ok value type
 * @template FromErr original Err error type
 * @template ToValue mapped Ok value type
 * @template ToErr mapped Err error type
 * @param {import("../../types").Mapper<FromValue, Result<ToValue, ToErr>>} mapper A function that maps the Ok value to a new Result.
 * @returns An operator that takes an original Result and returns a transformed, potentially flattened result.
 * @see {@link map}
 * @see {@link unfold}
 */
export function flatmap<FromValue, FromErr, ToValue, ToErr>(
  mapper: (ok: FromValue) => Result<ToValue, ToErr>
): Operator<Result<FromValue, FromErr>, Result<ToValue, FromErr | FromValue>> {
  return result => R.flatmap(result, mapper);
}

/**
 * Checks if the `Ok` value of a `Result` meets a specified condition. If the condition is met, the original `Result` is returned. If not, it returns an `Err` with a new error.
 * @template V The type of the `Ok` value.
 * @template E The original error type.
 * @template FailErr The type of the new error when the check fails.
 * @param {import("../../types").Predicate<V>} predicate A function that checks the `Ok` value against a condition.
 * @param {FailErr} failError The error to return if the check fails.
 * @returns An operator that returns the original `Result` if the check passes, or a new `Err` with the `failError`.
 */
export function check<V, E, FailErr>(
  predicate: (ok: V) => boolean,
  failError: FailErr
): Operator<Result<V, E>, Result<V, E | FailErr>> {
  return result => R.check(result, predicate, failError);
}
