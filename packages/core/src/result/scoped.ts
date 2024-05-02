import { isOk, Result, Ok, Err, isErr } from ".";
import { Operator } from "../types";
import { isFunction } from "../utility";

/**
 * Converts procedure that could potentially throw into `Result`
 * @constructor
 * @template V inner `Ok` value type
 * @template E inner `Err` error type
 * @param {Procedure<V>} $try function that return `Ok` value but could potententially throw
 * @param {Procedure<V>} $catch called with unknown error if `$try` throws. Returns `Err` error
 * @returns {Result<V, E>} `Ok` if `$try` succeeds. `Err` if it throws error
 */
export function FromTryCatch<V, E>(
  $try: () => V,
  $catch: (error: unknown) => E
): Result<V, E>;

/**
 * Converts procedure that could potentially throw into `Result`
 * @constructor
 * @template V inner `Ok` value type
 * @param {Procedure<V>} $try function that return `Ok` value but could potententially throw
 * @returns {Result<V, unknown>} `Ok` if `$try` succeeds. `Err` if it throws error with unknown error
 */
export function FromTryCatch<V>($try: () => V): Result<V, unknown>;

/**
 * @internal
 */
export function FromTryCatch<V, E>(
  $try: () => V,
  $catch?: (error: unknown) => E
): Result<V, unknown> | Result<V, E> {
  try {
    return Ok($try());
  } catch (e) {
    return $catch ? Err($catch(e)) : Err(e);
  }
}

/**
 * Error thrown for `take` operation
 * @see {@link take}
 */
export class TakeError extends Error {
  constructor() {
    super("trying to take value from `None` instance");
  }
}

/**
 * Dangerously assumes input `Result` is instance of `Ok`. Operator returns inner `Ok` value
 * @template V inner `Ok` value type
 * @throws {TakeError} when input is not instance of `Ok`
 * @returns {Operator<Result<V, any>, V>} inner `Some` value
 * @see {@link or}
 * @see {@link TakeError}
 */
export function take<V>(): Operator<Result<V, any>, V> {
  return result => {
    if (isOk(result)) return result.value;
    throw new TakeError();
  };
}

/**
 * Peek into `Ok` value if present
 * @param {Operator<V, any>} f function that's provided inner `Ok` value in the case input `Result` is instance of `Ok`
 * @returns {Operator<Result<V, E>, Result<V, E>>} `Operator` that takes a `Result` and returns the same `Result`
 */
export function peek<V, E>(
  f: (ok: V) => any
): Operator<Result<V, E>, Result<V, E>> {
  return result => {
    if (isOk(result)) f(result.value);
    return result;
  };
}

/**
 * Peek into `Err` error if present
 * @param {Operator<E, any>} f function that's provided inner `Err` error in the case input `Result` is instance of `Err`
 * @returns {Operator<Result<V, E>, Result<V, E>>} `Operator` that takes a `Result` and returns the same `Result`
 */
export function peekErr<V, E>(
  f: (err: E) => any
): Operator<Result<V, E>, Result<V, E>> {
  return result => {
    if (isErr(result)) f(result.error);
    return result;
  };
}

/**
 * Transforms inner value of `Ok` with provided mapping function. Otherwise returns same `Err` result
 * @param {Mapper<From, To>} mapper mapping function
 * @template From input `Result`s `Ok` value type
 * @template E input `Result`s `Err` error type
 * @template To output `Resutl`s `Ok` value type
 * @returns {Result<From, E>, Result<To, E>} function that takes input `Result<From, E>` and returns mapped `Result<To, E>`
 */
export function map<From, E, To>(
  mapper: (ok: From) => To
): Operator<Result<From, E>, Result<To, E>> {
  return result => (isOk(result) ? Ok(mapper(result.value)) : result);
}

export function mapErr<V, From, To>(
  mapper: (error: From) => To
): Operator<Result<V, From>, Result<V, To>> {
  return result => (isErr(result) ? Err(mapper(result.error)) : result);
}

/**
 * Returns alternative value if input `Result` is intance of `Err`
 * @template V inner `Ok` value type
 * @template E inner `Err` error type
 * @param {Mapper<E, V>} f function that recives `Err`s error and returns alternative value
 * @returns function with `Result` input and `V` output
 */
export function or<V, E>(f: (error: E) => V): Operator<Result<V, E>, V>;

/**
 * Returns altenative value if input `Result` is instance of `Err`
 * @template V inner `Ok` value type
 * @param {V} value alternative value
 * @returns function with `Result` input and `V` output
 */
export function or<V>(value: V): Operator<Result<V, any>, V>;

/**
 * @internal
 */
export function or<V, E>(
  fOrValue: ((error: E) => V) | V
): Operator<Result<V, E>, V> {
  return (result: Result<V, E>): V =>
    isOk(result) ? result.value
    : isFunction(fOrValue) ? fOrValue(result.error)
    : fOrValue;
}

export function flatmap<FromValue, FromError, ToValue, ToError>(
  mapper: (ok: FromValue) => Result<ToValue, ToError>
): Operator<
  Result<FromValue, FromError>,
  Result<ToValue, FromError | FromValue>
> {
  return result =>
    isOk(result) ?
      (mapper(result.value) as Result<ToValue, FromError | FromValue>)
    : result;
}
