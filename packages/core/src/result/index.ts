import { Empty, VOID } from "../const";
import { Procedure } from "../types";

/**
 * @todo docs
 */
export type Ok<V> = { kind: "ok"; value: V };

/**
 * @todo docs
 */
export type Err<E> = { kind: "err"; error: E };

/**
 * @todo docs
 */
export type Result<V = Empty, E = Empty> = Ok<V> | Err<E>;

/**
 * @todo runtime tests
 * @todo type tests
 * Creates a new `Ok` result with an empty value.
 * @returns An `Ok` result containing an empty value.
 */
export function Ok(): Ok<Empty>;

/**
 * @todo runtime tests
 * @todo type tests
 * Creates a new `Ok` result with a value.
 * @template V The type of the value.
 * @param value The value to store in the `Ok` result.
 * @returns An `Ok` result containing the value.
 */
export function Ok<V>(value: V): Ok<V>;

/**
 * @internal
 * @todo runtime tests
 * @todo docs
 */
export function Ok<V>(value?: V): Ok<V> | Ok<Empty> {
  return value !== undefined ?
      {
        kind: "ok",
        value,
      }
    : { kind: "ok", value: VOID };
}

/**
 * @todo fix docs!
 * @todo runtime tests
 * @todo type tests
 * Creates a new `Err` result that may contain an error or be empty. Specify a type to create an `Err<E | Empty>`.
 * @see {@link Result.Err<E>(error: E): Err<E>} To create a specific `Err<E>` without the `Empty`
 * @template E The type of the error.
 * @returns An `Err<E | Empty>` result that may contain an error or be empty.
 */
export function Err<E = Empty>(): Err<E | Empty>;

/**
 * @todo runtime tests
 * @todo type tests
 * Creates a new `Err` result containing the provided error.
 * @template E The type of the error.
 * @param error The error to store in the `Err` result.
 * @returns An `Err` result containing the error.
 */
export function Err<E>(error: E): Err<E>;

/**
 * @internal
 * @todo runtime tests
 * @todo docs
 */
export function Err<E>(error?: E): Err<E> | Err<E | Empty> {
  return error !== undefined ?
      { kind: "err", error }
    : { kind: "err", error: VOID };
}

/**
 * @todo runtime tests
 * @todo type tests
 * Converts a promise or a promise-returning function into a `Promise<Result<V, unknown>>`.
 * @template V The type of resolved value of the promise.
 * @param promise A promise or a function that returns a promise to convert.
 * @returns A promise that resolves to a `Result` of the value or unknown error.
 */
export async function FromPromise<V>(
  promise: Promise<V> | (() => Promise<V>)
): Promise<Result<V, unknown>>;

/**
 * @todo runtime tests
 * @todo type tests
 * Converts a promise or a promise-returning function into a `Promise<Result<V, E>>`, mapping the error using a provided function.
 * @template V The type of resolved value of the promise.
 * @template E The type of the error after being mapped.
 * @param promise A promise or a function that returns a promise to convert.
 * @param mapper A function to map the caught error to type `E`.
 * @returns A promise that resolves to a `Result` of the value or mapped error.
 */
export async function FromPromise<V, E>(
  promise: Promise<V> | (() => Promise<V>),
  mapper: (error: unknown) => E
): Promise<Result<V, E>>;

/** @internal */
export async function FromPromise<V, E>(
  promise: Promise<V> | (() => Promise<V>),
  mapper?: (error: unknown) => E
): Promise<Result<V, E> | Result<V, unknown>> {
  try {
    return typeof promise === "function" ?
        Ok(await promise())
      : Ok(await promise);
  } catch (e) {
    return mapper ? Err(mapper(e)) : Err(e);
  }
}

/**
 * @todo runtime tests
 * @todo type tests
 * Attempts to execute a function and captures the result or error in a `Result`, with error mapping.
 * @template V The type of the value returned by the function.
 * @template E The type of the error after being mapped.
 * @param fn The function to execute.
 * @param mapper A function to map the caught error to type `E`.
 * @returns A `Result<V, E>` capturing the function's return value or mapped error.
 */
export function FromTryCatch<V, E>(
  fn: () => V,
  mapper: (error: unknown) => E
): Result<V, E>;

/**
 * @todo runtime tests
 * @todo type tests
 * Attempts to execute a function and captures the result or error in a `Result`.
 * @template V The type of the value returned by the function.
 * @param fn The function to execute.
 * @returns A `Result<V, unknown>` capturing the function's return value or error.
 */
export function FromTryCatch<V>(fn: () => V): Result<V, unknown>;

/** @internal */
export function FromTryCatch<V, E>(
  fn: () => V,
  mapper?: (error: unknown) => E
): Result<V, unknown> | Result<V, E> {
  try {
    return Ok(fn());
  } catch (e) {
    return mapper ? Err(mapper(e)) : Err(e);
  }
}

/**
 * @todo docs
 * @todo runtime tests
 * @todo type tests
 */
export function isOk<V>(result: Result<V, any>): result is Ok<V> {
  return result.kind === "ok";
}

/**
 * @todo docs
 * @todo runtime tests
 * @todo type tests
 */
export function isErr<E>(result: Result<any, E>): result is Err<E> {
  return result.kind === "err";
}

export function map<R extends Result.Any, Output = R>(
  f: (ok: OkOf<R>) => Output
): Procedure<R, Result<Output, ErrOf<R>>> {
  return (result: R): Result<Output, ErrOf<R>> =>
    isOk(result) ? Ok(f(result.value)) : result;
}

export namespace Result {
  /**
   * @todo docs
   * @todo type tests
   */
  export type Any = Result<any, any>;
}

export type ErrOf<R extends Result.Any> =
  R extends Result<any, infer E> ? E : never;

export type OkOf<R extends Result.Any> =
  R extends Result<infer O, any> ? O : never;

type F = Result<number, unknown>;

type T = OkOf<F>;

type E = ErrOf<F>;

type G = F extends Result<infer Ok, unknown> ? Ok : never; // number
