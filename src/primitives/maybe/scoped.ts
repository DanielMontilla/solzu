import { Future, Maybe, None, Some, isMaybe, isNone, isSome } from ".";
import { Operator } from "../../types";

/**
 * Alias for `Maybe.Flatten`
 * @template M input `Maybe`
 * @retuns flattened maybe
 * @see {@link Maybe.Flatten}
 */
export type Flatten<M extends Maybe.Any> = Maybe.Flatten<M>;

/**
 * Alias for `Maybe.Unfold`
 * @template R input `Result`
 * @template Limit maximun unfold depth. Default `typeof MAX_UNFOLD_DEPTH`
 * @returns unfolded result up to `Limit`
 * @see {@link Result.Unfold}
 */
export type Unfold<
  M extends Maybe.Any,
  Limit extends number = typeof MAX_UNFOLD_DEPTH,
> = Maybe.Unfold<M, Limit>;

/**
 * Converts nullish value into `Maybe`
 * @constructor
 * @template V value
 * @param {V} value
 * @returns {Maybe<Exclude<V, null | undefined>>} `Some` if `value` in non nullish. `None` otherwise
 */
export function FromNullish<V>(value: V): Maybe<Exclude<V, null | undefined>> {
  if (value === null || value === undefined) return None();
  return Some(value as Exclude<V, null | undefined>);
}

/**
 * Converts `Promise` into `Future`.
 * @constructor
 * @template V inner `Some` type
 * @param {Promise<V>} promise target promise
 * @returns {Future<V>} a future. `Some` if the promise resolved with expected value. `None` if it threw error/failed.
 * @see {@link Future}
 */
export async function FromPromise<V>(promise: Promise<V>): Future<V> {
  try {
    return Some(await promise);
  } catch (_) {
    return None();
  }
}

/**
 * Converts procedure that could potentially throw into `Maybe`
 * @constructor
 * @template V inner type of possible `Some` value
 * @param {Procedure<V>} f that could throw
 * @returns {Maybe<V>} `Some` if procedure succeeds. `None` if it throws error
 */
export function FromTryCatch<V>(f: () => V): Maybe<V> {
  try {
    return Some(f());
  } catch (_) {
    return None();
  }
}

/**
 * Transforms the inner value of `Some` with the provided mapping function. Otherwise, returns `None`
 * @template From input `Maybe`s `Some` value
 * @template To output `Maybe`s `Some` value
 * @param {Mapper<From, To>} mapper mapping function
 * @returns {Operator<Maybe<From>, Maybe<From | To>>} maybe of original `Some` type or output type
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
): Operator<Maybe<From>, Maybe<From | To>> {
  return maybe => (isSome(maybe) ? Some(mapper(maybe.value)) : maybe);
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
 * @returns {Operator<Maybe<V>, V>} inner `Some` value
 * @see {@link or}
 * @see {@link TakeError}
 */
export function take<V>(): Operator<Maybe<V>, V> {
  return maybe => {
    if (isSome(maybe)) return maybe.value;
    throw new TakeError();
  };
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
  return maybe => (isSome(maybe) ? maybe.value : value);
}

/**
 * @internal
 */
export const MAX_UNFOLD_DEPTH = 512;

/**
 * Turns a nested maybe into a maybe of depth 1. Input maybe should never exceed a depth of `MAX_UNFOLD_DEPTH`.
 * @template V inner Some value type
 * @returns flattened maybe
 * @see {@link MAX_UNFOLD_DEPTH}
 */
export function unfold<V>(): Operator<Maybe<V>, Unfold<Maybe<V>>> {
  return maybe => {
    if (isNone(maybe)) return maybe as Unfold<Maybe<V>>;

    let inner = maybe.value;

    for (let i = 0; i < MAX_UNFOLD_DEPTH; i++) {
      if (!isMaybe(inner)) break;
      if (isNone(inner)) return inner as Unfold<Maybe<V>>;
      inner = inner.value;
    }

    return Some(inner) as Unfold<Maybe<V>>;
  };
}

/**
 * Turns a nested `Maybe` into a maybe with 1 less depth.
 * @template V inner `Some` value type
 * @returns function with nested maybe input and returns flattened maybe
 */
export function flatten<V>(): Operator<Maybe<V>, Flatten<Maybe<V>>> {
  return maybe => {
    if (isNone(maybe) || !isMaybe(maybe.value) || isNone(maybe.value))
      return maybe as Flatten<Maybe<V>>;

    return maybe.value as Flatten<Maybe<V>>;
  };
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
  return maybe => {
    if (isSome(maybe)) return mapper(maybe.value);
    return None();
  };
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
  return maybe => {
    if (isSome(maybe)) return predicate(maybe.value) ? maybe : None();
    return None();
  };
}

export function peek<V>(f: (some: V) => any): Operator<Maybe<V>, Maybe<V>> {
  return maybe => {
    if (isSome(maybe)) f(maybe.value);
    return maybe;
  };
}
