import {
  isOk,
  Result,
  Ok,
  Err,
  isErr,
  isResult,
  RESULT_MAX_UNFOLD_DEPTH,
  ResultFromTryCatch,
} from ".";
import { isFunction } from "../..";

/**
 * Alias for `Result.Flatten`
 * @template R The input `Result` type.
 * @returns The flattened result, reducing nesting by one depth.
 * @see {@link Result.Flatten}
 */
export type Flatten<R extends Result.Any> = Result.Flatten<R>;

/**
 * Alias for `Result.Unfold`
 * @template R The input `Result` type.
 * @template Limit The maximum depth to unfold, defaulting to `RESULT_MAX_UNFOLD_DEPTH`.
 * @returns The unfolded result up to the specified limit.
 * @see {@link Result.Unfold}
 */
export type Unfold<
  R extends Result.Any,
  Limit extends number = typeof RESULT_MAX_UNFOLD_DEPTH,
> = Result.Unfold<R, Limit>;

/**
 * Alias re-export for `ResultFromTryCatch`
 * @see {@link ResultFromTryCatch}
 */
export const FromTryCatch = ResultFromTryCatch;

/**
 * Error thrown when attempting to take a value from a `Result` that is an instance of `Err`.
 * @extends Error
 */
export class TakeError extends Error {
  constructor() {
    super("Attempting to take value from an `Err` instance.");
  }
}

/**
 * Extracts the value from a `Result` if it is `Ok`, otherwise throws `TakeError`.
 * @template V The inner `Ok` value type.
 * @param {Result<V, any>} result The result to extract from.
 * @returns {V} The inner `Ok` value.
 * @throws {TakeError} When the result is not an instance of `Ok`.
 * @see {@link or}
 */
export function take<V>(result: Result<V, any>): V {
  if (isOk(result)) return result.value;
  throw new TakeError();
}

/**
 * Executes a function on the `Ok` value if present.
 * @template V The inner `Ok` value type.
 * @template E The inner `Err` error type.
 * @param {Result<V, E>} result The result to check.
 * @param {(ok: V) => void} f A function to execute on the `Ok` value.
 * @returns {Result<V, E>} The original result.
 */
export function peek<V, E>(
  result: Result<V, E>,
  f: (ok: V) => void
): Result<V, E> {
  if (isOk(result)) f(result.value);
  return result;
}

/**
 * Executes a function on the `Err` value if present.
 * @template V The inner `Ok` value type.
 * @template E The inner `Err` error type.
 * @param {Result<V, E>} result The result to check.
 * @param {(err: E) => void} f A function to execute on the `Err` value.
 * @returns {Result<V, E>} The original result.
 */
export function peekErr<V, E>(
  result: Result<V, E>,
  f: (err: E) => void
): Result<V, E> {
  if (isErr(result)) f(result.error);
  return result;
}

/**
 * Transforms the `Ok` value of a `Result` using a provided function, or returns the original `Err`.
 * @template From The type of the `Ok` value before transformation.
 * @template To The type of the `Ok` value after transformation.
 * @template E The error type of the `Result`.
 * @param {Result<From, E>} result The result to transform.
 * @param {import("../../types").Mapper<From, To>} mapper A function to transform the `Ok` value.
 * @returns {Result<To, E>} The transformed result.
 */
export function map<From, To, E>(
  result: Result<From, E>,
  mapper: (ok: From) => To
): Result<To, E> {
  return isOk(result) ? Ok(mapper(result.value)) : result;
}

/**
 * Transforms the `Err` value of a `Result` using a provided function, or returns the original `Ok`.
 * @template V The type of the `Ok` value.
 * @template From The original error type.
 * @template To The new error type.
 * @param {Result<V, From>} result The result to transform.
 * @param {import("../../types").Mapper<From, To>} mapper A function to transform the `Err` value.
 * @returns {Result<V, To>} The transformed result.
 */
export function mapErr<V, From, To>(
  result: Result<V, From>,
  mapper: (error: From) => To
): Result<V, To> {
  return isErr(result) ? Err(mapper(result.error)) : result;
}

/**
 * Returns an alternative value or executes a function if the input `Result` is an instance of `Err`.
 * @template V The inner `Ok` value type.
 * @template E The inner `Err` error type.
 * @param {Result<V, E>} result The result to check.
 * @param {V | ((error: E) => V)} alternative The alternative value or function to execute if `Err`.
 * @returns {V} Either the `Ok` value or the alternative result.
 */
export function or<V, E>(
  result: Result<V, E>,
  alternative: V | ((error: E) => V)
): V {
  return (
    isOk(result) ? result.value
    : isFunction(alternative) ? alternative(result.error)
    : alternative
  );
}

/**
 * Unfolds a nested `Result` into a result of depth 1, only for the `Ok` channel.
 * @template V The inner `Ok` value type.
 * @template E The inner `Err` error type.
 * @param {Result<V, E>} result The result to unfold.
 * @returns {Result.Unfold<Result<V, E>>} The unfolded result.
 */
export function unfold<V, E>(
  result: Result<V, E>
): Result.Unfold<Result<V, E>> {
  if (isErr(result)) return result as Result.Unfold<Result<V, E>>;

  let inner = result.value;

  for (let i = 0; i < RESULT_MAX_UNFOLD_DEPTH; i++) {
    if (!isResult(inner)) break;
    if (isErr(inner)) return inner as Result.Unfold<Result<V, E>>;
    inner = inner.value;
  }

  return Ok(inner) as Result.Unfold<Result<V, E>>;
}

/**
 * Flattens a nested `Result` into a result with 1 less depth, focusing on the `Ok` channel.
 * @template V The inner `Ok` value type.
 * @template E The inner `Err` error type.
 * @param {Result<V, E>} result The result to flatten.
 * @returns {Result.Flatten<Result<V, E>>} The flattened result.
 */
export function flatten<V, E>(
  result: Result<V, E>
): Result.Flatten<Result<V, E>> {
  if (isErr(result) || !isResult(result.value) || isErr(result.value))
    return result as Result.Flatten<Result<V, E>>;

  return result.value as Result.Flatten<Result<V, E>>;
}

/**
 * Transforms and potentially changes the type of error based on the `Ok` value of a `Result`.
 * @template FromValue The original `Ok` value type.
 * @template FromErr The original `Err` error type.
 * @template ToValue The new `Ok` value type.
 * @template ToErr The new `Err` error type.
 * @param {Result<FromValue, FromErr>} result The result to transform.
 * @param {import("../../types").Mapper<FromValue, Result<ToValue, ToErr>>} mapper A function that maps and potentially changes the error type.
 * @returns {Result<ToValue, FromErr | ToErr>} The new result, potentially with a new error type.
 */
export function flatmap<FromValue, FromErr, ToValue, ToErr>(
  result: Result<FromValue, FromErr>,
  mapper: (ok: FromValue) => Result<ToValue, ToErr>
): Result<ToValue, FromErr | FromValue> {
  return isOk(result) ?
      (mapper(result.value) as Result<ToValue, FromErr | FromValue>)
    : result;
}

/**
 * Checks if the `Ok` value of a `Result` meets a specified condition. If the condition is met, the original `Result` is returned; otherwise, an `Err` with a new error is returned.
 *
 * @template V The type of the `Ok` value.
 * @template E The original error type.
 * @template FailErr The type of the new error when the check fails.
 * @param {Result<V, E>} result The result to check.
 * @param {import("../../types").Predicate<V>} predicate A function that tests the `Ok` value against a condition.
 * @param {FailErr} failError The error to return if the check fails.
 * @returns {Result<V, E | FailErr>} The original `Result` if the check passes, or a new `Err` with the `failError`.
 */
export function check<V, E, FailErr>(
  result: Result<V, E>,
  predicate: (ok: V) => boolean,
  failError: FailErr
): Result<V, E | FailErr> {
  return (
    isOk(result) ?
      predicate(result.value) ? result
      : Err(failError)
    : result
  );
}
