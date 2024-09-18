import {
  isMaybe,
  isNone,
  isSome,
  Maybe,
  MAYBE_MAX_UNFOLD_DEPTH,
  MaybeFromNullish,
  MaybeFromPromise,
  MaybeFromTryCatch,
  None,
  Some,
} from ".";
import { Nothing } from "../nothing";

import { hasKey, isObject } from "../object";
import { Err, Ok, Result } from "../result";
import { DynamicRecord, Guard } from "../types";

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
 * Transforms the inner value of `Some` with the provided mapping function. Otherwise, returns `None`.
 * @template From input `Maybe`s `Some` value
 * @template To output `Maybe`s `Some` value
 * @param {Mapper<From, To>} mapper mapping function
 * @returns {Maybe<To>} new mapped `Maybe<To>` if input was `Some`
 */
export function map<From, To>(maybe: Maybe<From>, mapper: (some: From) => To): Maybe<To> {
  return isSome(maybe) ? Some(mapper(maybe.value)) : maybe;
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
 * Dangerously assumes input is instance of `Some` and return inner value. Use of `or` is recommended instead.
 * @template V inner `Some` value type
 * @throws {TakeError} when input is not instance of `Some`
 * @returns {V} inner `Some` value
 * @see {@link or}
 * @see {@link TakeError}
 */
export function take<V>(maybe: Maybe<V>): V {
  if (isSome(maybe)) return maybe.value;
  throw new TakeError();
}

/**
 * If input is instance of `Some` returns inner value. Otherwise returns the alternative provided `value`
 * @template V inner `Some` value type
 * @param {V} value alternative return value when provided input is instance of `None`
 * @returns {V} `Some`'s inner value or the provided value
 */
export function or<V>(maybe: Maybe<V>, value: V): V;

/**
 * If input is instance of `Some` returns inner value. Otherwise returns the alternative provided `value`
 * @template V inner `Some` value type of provided `Maybe` input
 * @template Other type of alternative return value
 * @param {Other} other alternative return value when provided input is instance of `None`
 * @returns {V | Other} `Some`'s inner value or the provided value
 */
export function or<V, Other>(maybe: Maybe<V>, other: Other): V | Other;

/**
 * @internal
 */
export function or<V, Other = V>(maybe: Maybe<V>, valueOrOther: V | Other): V | Other {
  return isSome(maybe) ? maybe.value : valueOrOther;
}

/**
 * Turns a nested maybe into a maybe of depth 1. Input maybe should never exceed a depth of `MAX_UNFOLD_DEPTH`.
 * @template V inner Some value type
 * @returns {Unfold<Maybe<V>>} flattened maybe
 * @see {@link MAYBE_MAX_UNFOLD_DEPTH}
 */
export function unfold<V>(maybe: Maybe<V>): Unfold<Maybe<V>> {
  if (isNone(maybe)) return maybe as Unfold<Maybe<V>>;
  let inner = maybe.value;
  for (let i = 0; i < MAYBE_MAX_UNFOLD_DEPTH; i++) {
    if (!isMaybe(inner)) break;
    if (isNone(inner)) return inner as Unfold<Maybe<V>>;
    inner = inner.value;
  }
  return Some(inner) as Unfold<Maybe<V>>;
}

/**
 * Turns a nested `Maybe` into a maybe with 1 less depth.
 * @template V inner `Some` value type
 * @returns {Flatten<Maybe<V>>} flattened maybe
 */
export function flatten<V>(maybe: Maybe<V>): Flatten<Maybe<V>> {
  if (isNone(maybe) || !isMaybe(maybe.value) || isNone(maybe.value))
    return maybe as Flatten<Maybe<V>>;
  return maybe.value as Flatten<Maybe<V>>;
}

/**
 * Combines `map` and `flatten`. Inner some value is mapped onto new `Maybe` which is then flattened.
 * @template From input `Maybe`s `Some` value type
 * @template To output `Maybe`s `Some` value type
 * @param {Operator<From, Maybe<To>>} mapper mapping function
 * @returns {Maybe<To>} new mapped and flattened `Maybe<To>`
 * @see {@link map}
 * @see {@link flatten}
 */
export function flatmap<From, To>(
  maybe: Maybe<From>,
  mapper: (some: From) => Maybe<To>
): Maybe<To> {
  return isSome(maybe) ? mapper(maybe.value) : None();
}

/**
 * Checks `Some`'s value against provided predicate condition. If passed returns the same `Some`, otherwise `None`
 * @template V inner `Some`'s value type
 * @param {import("../../types").Predicate<V>} predicate function to check inner `Some` value (if it exists)
 * @returns {Maybe<V>} same `Maybe` if instance of `Some` and predicate evaluates to `true`, otherwise `None`
 */
export function check<V>(maybe: Maybe<V>, predicate: (some: V) => boolean): Maybe<V> {
  return isSome(maybe) ? (predicate(maybe.value) ? maybe : None()) : None();
}

/**
 * Performs a side effect on the inner value of `Some` and returns the same `Maybe`
 * @template V inner `Some` value type
 * @param {import("../../types").Effect.Unary<V>} f function with single argument of `V`
 * @returns {Maybe<V>} same `Maybe`
 */
export function peek<V>(maybe: Maybe<V>, f: (some: V) => any): Maybe<V> {
  if (isSome(maybe)) f(maybe.value);
  return maybe;
}

/**
 * Extracts value of object property if it exists
 * @template V inner `Some` value type. Must extend any `Record` or `Object` type
 * @template K type of `V` indexable key
 * @param {K} key the key to look for
 * @returns {Maybe<V[K]>} `Some` if input is `Some` and given property exists. Otherwise `None`
 */
export function property<V extends DynamicRecord, K extends keyof V>(
  maybe: Maybe<V>,
  key: K
): Maybe<V[K]> {
  if (isNone(maybe)) return maybe;
  if (!isObject(maybe.value) || !hasKey(maybe.value, key)) return None();
  return Some(maybe.value[key]);
}

/**
 * Checks if the inner value of `Some` matches the provided guard
 * @template Type the type to check against
 * @param {Guard<Type>} guard function to check inner value
 * @returns {Maybe<Type>} `Some` if input is `Some` and guard evaluates to `true`. Otherwise `None`
 */
export function is<Type>(maybe: Maybe.Any, guard: Guard<Type>): Maybe<Type> {
  if (isNone(maybe)) return maybe;
  return guard(maybe.value) ? Some(maybe.value) : None();
}

/**
 * Performs some side effect when input `Maybe` is instance of `Some`
 * @template V inner `Some` value type
 * @param {import("../../types").Effect.Unary<V>} f function with single argument of `V`
 * @returns {Maybe<V>} same `Maybe`
 */
export function onSome<V>(maybe: Maybe<V>, f: (some: V) => any): Maybe<V> {
  if (isSome(maybe)) f(maybe.value);
  return maybe;
}

/**
 * Performs some side effect when input `Maybe` is instance of `None`
 * @template V inner `Some` value type
 * @param {import("../../types").Effect} f function with no parameters. Can return anything
 * @returns {Maybe<V>} same `Maybe`
 */
export function onNone<V>(maybe: Maybe<V>, f: () => any): Maybe<V> {
  if (isNone(maybe)) f();
  return maybe;
}

/**
 * Performs an effect based on the instance type of the input `Maybe`.
 * @template V the type of value contained within `Some`
 * @param {Object} branches object containing the possible branches
 * - `some`: function that takes the value of `Some` as an argument and can return anything.
 * - `none`: function that takes no arguments and can return anything.
 * @returns {Maybe<V>} same `Maybe`
 */
export function match<V>(
  maybe: Maybe<V>,
  branches: { some: (value: V) => any; none: () => any }
): Maybe<V> {
  isSome(maybe) ? branches.some(maybe.value) : branches.none();
  return maybe;
}

/**
 * Like `map` but with mapper that could throw
 * @template From original inner `Some` value type
 * @template To output inner `Some` value type
 * @param {import("../../types").Mapper<From, To>} mapper function that maps inner `Some` value to some other value. Could throw.
 * @returns {Maybe<To>} mapped `Maybe<To>` or `None` if input is `None` or mapper throws
 * @see {@link map}
 */
export function tryMap<From, To>(maybe: Maybe<From>, mapper: (some: From) => To): Maybe<To> {
  if (isNone(maybe)) return maybe;
  try {
    return Some(mapper(maybe.value));
  } catch {
    return None();
  }
}

/**
 * Safely tries to parse json string. If the parsing throws errors, operator returns `None`
 * @returns {Maybe<any>} `Some` if parsing was successful, otherwise `None`
 */
export function parseJson(maybe: Maybe<string>): Maybe<any> {
  if (isNone(maybe)) return maybe;
  try {
    return Some(JSON.parse(maybe.value));
  } catch {
    return None();
  }
}

/**
 * Dangerously casts `Maybe`'s inner value. NOT RECOMMENDED. Use `is` instead
 * @template To outputs inner `Some` value type
 * @returns {Maybe<To>} function that takes any `Maybe` and turns it into `Maybe<To>`
 */
export function cast<To>(maybe: Maybe<any>): Maybe<To> {
  return maybe as unknown as Maybe<To>;
}

/**
 * Converts `Maybe` into `Result`
 * @template V target `Ok` value type
 * @template E target `Err` error type
 * @param {E} error value of error in case input `Maybe` is of instance `None`
 * @returns {Result<V, E>} converted `Result`
 */
export function toResult<V, E>(maybe: Maybe<V>, error: E): Result<V, E>;

/**
 * Converts `Maybe` into `Result`
 * @template V target `Ok` value type
 * @returns {Result<V, Nothing>} converted `Result`. Always `Nothing` in `Err` channel
 */
export function toResult<V>(maybe: Maybe<V>): Result<V, Nothing>;

/**
 * @internal
 */
export function toResult<V, E>(maybe: Maybe<V>, error?: E): Result<V, E | Nothing> {
  if (isNone(maybe)) return error ? Err(error) : Err();
  return Ok(maybe.value);
}
