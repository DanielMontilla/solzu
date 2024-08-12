import {
  type Maybe,
  type MAYBE_MAX_UNFOLD_DEPTH,
  MaybeFromNullish,
  MaybeFromPromise,
  MaybeFromTryCatch,
} from ".";
import type { DynamicRecord, Guard, Operator } from "../../types";
import { Nothing } from "../nothing";
import { Result } from "../result";
import type { TakeError } from "./mod";
import * as M from "./mod";

/**
 * Alias re-export for `Maybe.Flatten`
 * @template M input `Maybe`
 * @retuns flattened maybe
 * @see {@link Maybe.Flatten}
 */
export type Flatten<M extends Maybe.Any> = Maybe.Flatten<M>;

/**
 * Alias re-export for `Maybe.Unfold`
 * @template R input `Result`
 * @template Limit maximun unfold depth. Default `typeof MAX_UNFOLD_DEPTH`
 * @returns unfolded result up to `Limit`
 * @see {@link Result.Unfold}
 */
export type Unfold<
  M extends Maybe.Any,
  Limit extends number = typeof MAYBE_MAX_UNFOLD_DEPTH,
> = Maybe.Unfold<M, Limit>;

/**
 * Alias re-export for `MaybeFromNullish`
 * @constructor
 * @template V value
 * @param {V} value
 * @returns {Maybe<Exclude<V, null | undefined>>} `Some` if `value` in non nullish. `None` otherwise
 * @see {@link MaybeFromNullish}
 */
export const FromNullish = MaybeFromNullish;

/**
 * Alias re-export for `MaybeFromPromise`
 * @constructor
 * @template V inner `Some` type
 * @param {Promise<V>} promise target promise
 * @returns {Future<V>} a future. `Some` if the promise resolved with expected value. `None` if it threw error/failed.
 * @see {@link Future}
 * @see {@link MaybeFromPromise}
 */
export const FromPromise = MaybeFromPromise;

/**
 * Alias re-export for `MaybeFromTryCatch`
 * @constructor
 * @template V inner type of possible `Some` value
 * @param {Procedure<V>} f that could throw
 * @returns {Maybe<V>} `Some` if procedure succeeds. `None` if it throws error
 * @see {@link MaybeFromTryCatch}
 */
export const FromTryCatch = MaybeFromTryCatch;

/**
 * Transforms the inner value of `Some` with the provided mapping function. Otherwise, returns `None`
 * @template From input `Maybe`s `Some` value
 * @template To output `Maybe`s `Some` value
 * @param {Mapper<From, To>} mapper mapping function
 * @returns {Operator<Maybe<From>, Maybe<To>>} function that takes `Maybe<From>` input and returns new mapped `Maybe<To>` if input was `Some`
 * ### Use
 * @example
 * ```
 * const some = Some(1);
 * const none = None();
 * const mapper = (x: number) => x + 1;
 *
 * const mappedSome = map(mapper)(some);
 * console.log(mappedSome); // Some(2)
 *
 * const mappedNone = map(mapper)(none);
 * console.log(mappedNone); // None
 * ```
 */
export function map<From, To>(
  mapper: (some: From) => To
): Operator<Maybe<From>, Maybe<To>> {
  return maybe => M.map(maybe, mapper);
}

/**
 * Dangerously assumes input is instance of `Some` and return inner value. Use of `or` is recommended instead.
 * @template V inner `Some` value type
 * @throws {TakeError} when input is not instance of `Some`
 * @returns {Operator<Maybe<V>, V>} inner `Some` value
 * @see {@link or}
 * @see {@link TakeError}
 */
export function take<V>(): Operator<Maybe<V>, V> {
  return maybe => M.take(maybe);
}

/**
 * If input is instance of `Some` returns inner value. Otherwise returns the alternative provided `value`
 * @template V inner `Some` value type
 * @param {V} value alternative return value when provided input is instance of `None`
 * @returns {V} `Some`'s inner value or the provided value
 */
export function or<V>(value: V): Operator<Maybe<V>, V>;

/**
 * If input is instance of `Some` returns inner value. Otherwise returns the alternative provided `value`
 * @template V inner `Some` value type of provided `Maybe` input
 * @template Other type of alternative return value
 * @param {Other} value alternative return value when provided input is instance of `None`
 * @returns {V | Other} `Some`'s inner value or the provided value
 */
export function or<V, Other>(value: Other): Operator<Maybe<V>, V | Other>;

/**
 * @internal
 */
export function or<V, Other = V>(value: Other): Operator<Maybe<V>, V | Other> {
  return maybe => M.or(maybe, value);
}

/**
 * Turns a nested maybe into a maybe of depth 1. Input maybe should never exceed a depth of `MAX_UNFOLD_DEPTH`.
 * @template V inner Some value type
 * @returns flattened maybe
 * @see {@link MAYBE_MAX_UNFOLD_DEPTH}
 */
export function unfold<V>(): Operator<Maybe<V>, Unfold<Maybe<V>>> {
  return maybe => M.unfold(maybe);
}

/**
 * Turns a nested `Maybe` into a maybe with 1 less depth.
 * @template V inner `Some` value type
 * @returns function with nested maybe input and returns flattened maybe
 */
export function flatten<V>(): Operator<Maybe<V>, Flatten<Maybe<V>>> {
  return maybe => M.flatten(maybe);
}

/**
 * Combines `map` and `flatten`. Inner some value is mapped onto new `Maybe` which is then flattened.
 * @template From inputs `Maybe`s `Some` value type
 * @template To output `Maybe`s `Some` value type
 * @param {Operator<From, Maybe<To>>} mapper mapping function
 * @see {@link map}
 * @see {@link flatten}
 */
export function flatmap<From, To>(
  mapper: (some: From) => Maybe<To>
): Operator<Maybe<From>, Maybe<To>> {
  return maybe => M.flatmap(maybe, mapper);
}

/**
 * Checks `Some`'s value againts provided predicated condition. If passed returns the same `Some`, otherwise `None`
 * @template V inner `Some`'s value type
 * @param {Operator<V, boolean>} predicate function to check inner `Some` value (if it exists)
 * @returns {Operator<Maybe<V>, Maybe<V>>} function that takes `Maybe` and returns same `Maybe` if instance of `Some` and predicate evaluates to `true`. Otherwise `None`
 */
export function check<V>(
  predicate: (some: V) => boolean
): Operator<Maybe<V>, Maybe<V>> {
  return maybe => M.check(maybe, predicate);
}

export function peek<V>(f: (some: V) => any): Operator<Maybe<V>, Maybe<V>> {
  return maybe => M.peek(maybe, f);
}

/**
 * Extract value of object property
 * @template V inner `Some` value type. Must extends any `Record` or `Object` type
 * @template K type of `V` indexable key
 * @param {K} key the key to look for
 * @returns {Operator<Maybe<V>, Maybe<V[K]>>} function with input `Maybe<V>` and returns `Some` if input is `Some` and given property exists. Otherwise `None`
 */
export function property<V extends DynamicRecord, K extends keyof V>(
  key: K
): Operator<Maybe<V>, Maybe<V[K]>>;

/**
 * Extract value of object property if it exists
 * @template V inner `Some` value type. Must extends any `Record` or `Object` type
 * @param {K} key the key to look for
 * @returns {Operator<Maybe<V>, Maybe<unknown>>} function with input `Maybe<V>` and returns `Some` if input is `Some` and given property exists. Otherwise `None`
 */
export function property<V extends DynamicRecord>(
  key: PropertyKey
): Operator<Maybe<V>, Maybe<unknown>>;

/**
 * @internal
 */
export function property<V extends DynamicRecord, K extends keyof V>(
  key: K
): Operator<Maybe<V>, Maybe<V[K]>> {
  return maybe => M.property(maybe, key);
}

export function is<Type>(guard: Guard<Type>): Operator<Maybe.Any, Maybe<Type>> {
  return maybe => M.is(maybe, guard);
}

/**
 * Perfoms some side effect when input `Maybe` is instance of `Some`
 * @template V inner `Some` value type
 * @param {import("../../types").Effect.Unary<V>} f function with single argument of `V`
 * @returns {Operator<Maybe<V>, Maybe<V>>} function with `Maybe` input and returns that same `Maybe`
 */
export function onSome<V>(f: (some: V) => any): Operator<Maybe<V>, Maybe<V>> {
  return maybe => M.onSome(maybe, f);
}

/**
 * Perfoms some side effect when input `Maybe` is instance of `None`
 * @template V inner `Some` value type
 * @param {import("../../types").Effect} f function with no parameters. Can return anything
 * @returns {Operator<Maybe<V>, Maybe<V>>} function with `Maybe` input and returns that same `Maybe`
 */
export function onNone<V>(f: () => any): Operator<Maybe<V>, Maybe<V>> {
  return maybe => M.onNone(maybe, f);
}

/**
 * Performs an effect based on the instance type of the input `Maybe`.
 * @template V the type of value contained within `Some`
 * @param {Object} branches object containing the possible branches
 * - `some`: function that takes the value of `Some` as an argument and can return anything.
 * - `none`: function that takes no arguments and can return anything.
 * @returns {Operator<Maybe<V>, Maybe<V>>} a function that takes a `Maybe` input and returns that same `Maybe`
 */
export function match<V>(branches: {
  some: (value: V) => any;
  none: () => any;
}): Operator<Maybe<V>, Maybe<V>> {
  return maybe => M.match(maybe, branches);
}

/**
 * Like `map` but with mapper that could throw
 * @template From original inner `Some` value type
 * @template To output inner `Some` value type
 * @param {import("../../types").Mapper<From, To>} mapper function that maps inner `Some` value to some other value. Could throw.
 * @returns {Operator<Maybe<From>, Maybe<To>>} function that given input `Maybe` uses mapper function to map inner `Some` value. If input is `None` or `mapper` throws, function returns `None`
 * @see {@link map}
 */
export function tryMap<From, To>(
  mapper: (some: From) => To
): Operator<Maybe<From>, Maybe<To>> {
  return maybe => M.tryMap(maybe, mapper);
}

/**
 * Safely trys to parse json string. If the parsing throws errors, operator returns `None`
 * @returns {Operator<Maybe<string>, Maybe<any>>} function with input `Maybe<string>` attempts to `JSON.parse` it. If successful then `Some(value)` otherwise `None`
 */
export function parseJson(): Operator<Maybe<string>, Maybe<any>> {
  return maybe => M.parseJson(maybe);
}

/**
 * Dangerously casts `Maybe`'s inner value. NOT RECOMMENDED. Use `is` instead
 * @template To outputs inner `Some` value type
 * @returns {Operator<Maybe<any>, Maybe<To>>} function that takes any `Maybe` and turns it into `Maybe<To>`
 */
export function cast<To>(): Operator<Maybe<any>, Maybe<To>> {
  return maybe => M.cast(maybe);
}

/**
 * Converts `Maybe` into `Result`
 * @template V target `Ok` value type
 * @template E target `Err` error type
 * @param {E} error value of error incase input `Maybe` is of instance `None`
 * @returns {Operator<Maybe<V>, Result<V, E>>} function with input `Maybe`, and output of converted `Result`
 */
export function toResult<V, E>(error: E): Operator<Maybe<V>, Result<V, E>>;

/**
 * Converts `Maybe` into `Result`
 * @template V target `Ok` value type
 * @returns {Operator<Maybe<V>, Result<V, Nothing>>} function with input `Maybe`, and output of converted `Result`. Always `Nothing` in `Err` channel
 */
export function toResult<V>(): Operator<Maybe<V>, Result<V, Nothing>>;

/**
 * @internal
 */
export function toResult<V, E>(
  error?: E
): Operator<Maybe<V>, Result<V, E | Nothing>> {
  return maybe => (error ? M.toResult(maybe, error) : M.toResult(maybe));
}
