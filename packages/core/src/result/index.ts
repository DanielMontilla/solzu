import { Decrement, Nothing } from "..";
import { $CLASSIFIER, $SPECIFIER } from "../data";
import { MAX_UNFOLD_DEPTH } from "./scoped";

/**
 * Unique classifier for `Ok` type
 * @internal
 */
export const OK_CLASSIFIER = Symbol("solzu:core@ok");

/**
 * Unique specifier discriminator for `Ok` type
 * @internal
 */
export const OK_SPECIFIER = "ok" as const;

/**
 * Unique classifier for `Err` type
 * @internal
 */
export const ERR_CLASSIFIER = Symbol("solzu:core@err");

/**
 * Unique specifier discriminator for `Err` type
 * @internal
 */
export const ERR_SPECIFIER = "err" as const;

/**
 * Represents the successful outcome of operation
 * @template V type of inner value
 */
export type Ok<V> = {
  readonly [$CLASSIFIER]: typeof OK_CLASSIFIER;
  readonly [$SPECIFIER]: "ok";
  readonly value: V;
};

/**
 * Represents the unsuccessful outcome of operation
 * @template E type of inner error
 */
export type Err<E> = {
  readonly [$CLASSIFIER]: typeof ERR_CLASSIFIER;
  readonly [$SPECIFIER]: "err";
  readonly error: E;
};

/**
 * Either `Ok<V>` or `Err<E>`
 * @template V type of some's inner value
 */
export type Result<V = Nothing, E = Nothing> = Ok<V> | Err<E>;

export namespace Result {
  /**
   * Generic `Result` type. Extends `any` other result
   */
  export type Any = Result<any, any>;

  /**
   * Extracts the inner `Ok` type
   * @template R any `Result`
   * @returns inner `Ok` type
   */
  export type OkOf<R extends Any> = R extends Ok<infer V> ? V : never;

  /**
   * Extracts the inner `Err` type
   * @template R any `Result`
   * @returns inner `Err` type
   */
  export type ErrOf<R extends Any> = R extends Err<infer E> ? E : never;

  /**
   * Flattens nested `Result` type once
   * @template Root root `Result` type to flatten
   * @returns `Result` flattened once. Root and nested `Err`s are combined (union) for resulting `Err` type
   */
  export type Flatten<Root extends Any> =
    [Root] extends [Result<infer RootOk, infer RootErr>] ?
      [RootOk] extends [Result<infer NestedOk, infer NestedErr>] ?
        Result<NestedOk, RootErr | NestedErr>
      : Root
    : never;

  /**
   * Recursively flattens nested `Result` type **infinitely**. Not recommended for general use. Try simpler versions like `Flatten` or `Unfold`
   * @template Root `Result` type to unfold
   * @returns `Result` of depth 1. All `Err`'s are combined onto single union `Err`
   * @see {@link Result.Flatten}
   * @see {@link Result.Unfold}
   */
  export type InfiniteUnfold<Root extends Any> =
    [Root] extends [Result<infer RootOk, infer RootErr>] ?
      [RootOk] extends [Result<infer NestedOk, infer NestedErr>] ?
        InfiniteUnfold<Result<NestedOk, NestedErr | RootErr>>
      : Root
    : never;

  /**
   * Recursively flattens nested `Result` type up to `Limit`. For an **infinite** version checkout `Result.Unfold` or simpler `Result.Flatten`
   * @template Root `Result` type to unfold
   * @returns `Result` of depth 1 if depth ≤ `Limit`. Otherwise the unfolded result up to `Limit`
   * @see {@link Result.InfiniteUnfold}
   * @see {@link Result.Flatten}
   */
  export type Unfold<
    Root extends Any,
    Limit extends number = typeof MAX_UNFOLD_DEPTH,
  > =
    Limit extends 0 ? Root
    : [Root] extends [Result<infer RootOk, infer RootErr>] ?
      [RootOk] extends [Result<infer NestedOk, infer NestedErr>] ?
        Unfold<Result<NestedOk, NestedErr | RootErr>, Decrement<Limit>>
      : Root
    : never;
}

/**
 * Shorthand for `Promise` of a `Result`
 * @template V inner `Ok` type. Defaults to `Nothing`
 * @template E inner `Err` type. Defaults to `Nothing`
 * @returns {Promise<Result<V, E>>}
 */
export type Task<V = Nothing, E = Nothing> = Promise<Result<V, E>>;

/**
 * Alias for `Result.OkOf`
 * @template R any `Result`
 * @returns inner `Ok` type
 * @see {@link Result.OkOf}
 */
export type OkOf<R extends Result.Any> = Result.OkOf<R>;

/**
 * Alias for `Result.ErrOf`
 * @template R any `Result`
 * @returns inner `Err` type
 * @see {@link Result.ErrOf}
 */
export type ErrOf<R extends Result.Any> = Result.ErrOf<R>;

/**
 * Creates empty `Ok`
 * @constructor
 * @returns {Ok<Nothing>} empty `Ok`
 */
export function Ok(): Ok<Nothing>;

/**
 * Creates `Ok` w/ inner `value`
 * @constructor
 * @template V inner `value` type
 * @param {V} value
 * @returns {Some<V>} `Ok` with inner `value`
 */
export function Ok<V>(value: V): Ok<V>;

/**
 * @internal
 */
export function Ok<V>(value?: V): Ok<V> | Ok<Nothing> {
  return {
    [$CLASSIFIER]: OK_CLASSIFIER,
    [$SPECIFIER]: OK_SPECIFIER,
    value: value !== undefined ? value : Nothing(),
  } as Ok<V> | Ok<Nothing>;
}

/**
 * Creates empty `Err`
 * @constructor
 * @returns {Err<Nothing>} empty `Err`
 */
export function Err(): Err<Nothing>;

/**
 * Creates `Err` w/ inner `error`
 * @constructor
 * @template E inner `error` type
 * @param {E} error
 * @returns {Err<E>} `Err` with inner `error`
 */
export function Err<E>(error: E): Err<E>;

/**
 * @internal
 */
export function Err<E>(error?: E): Err<E> | Err<Nothing> {
  return {
    [$CLASSIFIER]: ERR_CLASSIFIER,
    [$SPECIFIER]: ERR_SPECIFIER,
    error: error !== undefined ? error : Nothing(),
  } as Err<E> | Err<Nothing>;
}

/**
 * Creates `Ok` with type of `Result<Nothing, Nothing>`
 * @constructor
 * @param {"ok"} kind
 * @returns {Result<Nothing, Nothing>} `Result` of type `Ok<Nothing>`
 */
export function Result(kind: "ok"): Result<Nothing, Nothing>;

/**
 * Creates `Ok` with type of `Result<V, Nothing>`
 * @constructor
 * @template V type of inner `Ok` value
 * @param {"ok"} kind
 * @param {V} value inner `Ok` value
 * @returns {Result<V, Nothing>} `Result` of type `Ok` with inner `value`
 */
export function Result<V>(kind: "ok", value: V): Result<V, Nothing>;

/**
 * Creates `Ok` with type of `Result<V, E>`
 * @constructor
 * @template V type of inner `Ok` value
 * @template E type of inner `Err` error
 * @param {"ok"} kind
 * @param {V} value inner `Ok` value
 * @returns {Result<V, E>} `Result` of type `Ok` with inner `value`
 */
export function Result<V = Nothing, E = Nothing>(
  kind: "ok",
  value: V
): Result<V, E>;

/**
 * Creates `Err` with type of `Result<Nothing, Nothing>`
 * @constructor
 * @param {"err"} kind
 * @returns {Result<Nothing, Nothing>} `Result` of type `Err<Nothing>`
 */
export function Result(kind: "err"): Result<Nothing, Nothing>;

/**
 * Creates `Err` with type of `Result<Nothing, E>`
 * @constructor
 * @template E type of inner `Err` error
 * @param {"err"} kind
 * @param {E} error inner `Err` error
 * @returns {Result<Nothing, E>} `Result` of type `Err` with inner `error`
 */
export function Result<E>(kind: "err", error: E): Result<Nothing, E>;

/**
 * Creates `Err` with type of `Result<V, E>`
 * @constructor
 * @template V type of inner `Ok` value
 * @template E type of inner `Err` error
 * @param {"err"} kind
 * @param {E} error inner `Err` error
 * @returns {Result<V, E>} `Result` of type `Err` with inner `error`
 */
export function Result<V = Nothing, E = Nothing>(
  kind: "err",
  error: E
): Result<V, E>;

/**
 * @internal
 */
export function Result<ValueOrError, Error>(
  kind: "ok" | "err",
  valueOrError?: ValueOrError | Error
):
  | Result<Nothing, Nothing>
  | Result<ValueOrError, Nothing>
  | Result<Nothing, ValueOrError>
  | Result<ValueOrError, Error> {
  switch (true) {
    case kind === "err" && valueOrError !== undefined:
      // Err<E> => Result<Nothing, E> or Result<V, E>
      return Err(valueOrError as Error);

    case kind === "err" && valueOrError === undefined:
      // Err<Nothing> => Result<Nothing, Nothing>
      return Err();

    case kind === "ok" && valueOrError !== undefined:
      // Ok<V> => Result<V, Nothing> or Result<V, E>
      return Ok(valueOrError as ValueOrError);

    default:
    case kind === "ok" && valueOrError === undefined:
      // Ok<Nothing> => Result<Nothing, Nothing>
      return Ok();
  }
}

/**
 * Checks if provided `Result` is `Ok`
 * @template V inner `Ok` type
 * @param {Result<V, any>} result result to be checked
 * @returns {boolean} `true` if `Ok`. Otherwise `false`
 */
export function isOk<V>(result: Result<V, any>): result is Ok<V> {
  return result.kind === "ok";
}

/**
 * Alias for `isOk`
 * @template V inner `Ok` value type
 * @param {Result<V, any>} result result to be checked
 * @returns {boolean} `true` if `Ok`. Otherwise `false`
 * @see {@link isOk}
 */
export const notErr = isOk;

/**
 * Checks if provided `Result` is `Err`
 * @template E inner `Err` error type
 * @param {Result<any, E>} result result to be checked
 * @returns {boolean} `true` if `Err`. Otherwise `false`
 */
export function isErr<E>(result: Result<any, E>): result is Err<E> {
  return result.kind === "err";
}

/**
 * Alias for `isErr`
 * @template E inner `Err` error type
 * @param {Result<any, E>} result result to be checked
 * @returns {boolean} `true` if `Err`. Otherwise- `false`
 * @see {@link isErr}
 */
export const notOk = isErr;

/**
 * Checks if provided `thing` is of type `Result`
 * @param {unknown} thing data to be checked
 * @returns {boolean} `true` if thing is `Maybe`. Otherwise `false`
 */
export function isResult(thing: unknown): thing is Result.Any {
  return (
    typeof thing == "object" &&
    thing !== null &&
    $CLASSIFIER in thing &&
    (thing[$CLASSIFIER] === OK_CLASSIFIER ||
      thing[$CLASSIFIER] === ERR_CLASSIFIER) &&
    $SPECIFIER in thing &&
    (thing[$SPECIFIER] === OK_SPECIFIER || thing[$SPECIFIER] === ERR_SPECIFIER)
  );
}
