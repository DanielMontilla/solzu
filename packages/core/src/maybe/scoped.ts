import { Future, Maybe, None, Some, isMaybe, isNone, isSome } from ".";
import { Operator, Procedure } from "../types";

export type Flatten<M extends Maybe.Any> = Maybe.Flatten<M>;

/**
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
 * @constructor
 * @template V inner `Some` type
 * @param {Promise<V>} promise
 * @returns {Future<V>} a future with inner maybe value
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
 * @constructor
 * @template V inner type of possible `Some` value
 * @param {Procedure<V>} procedure that could throw
 * @returns {Maybe<V>} `Some` if procedure succeeds. `None` if it throws error
 */
export function FromTryCatch<V>(procedure: Procedure<V>): Maybe<V> {
  try {
    return Some(procedure());
  } catch (_) {
    return None();
  }
}

/**
 * Transforms the inner value of `Some` with the provided mapping function. Otherwise, returns `None`.
 * @template From inner `Some` type of input
 * @template To expected output type of mapping return
 * @param {Operator<From, To>} mapper mapping function
 * @returns {Operator<Maybe<From>, Maybe<From | To>>} maybe of original `Some` type or output type.
 * @example
 * const some = Some(1);
 * const none = None();
 * const mapper = (x: number) => x + 1;
 *
 * const mappedSome = map(mapper)(some);
 * console.log(mappedSome); // Some(2)
 *
 * const mappedNone = map(mapper)(none);
 * console.log(mappedNone); // None
 */
export function map<From, To>(
  mapper: (some: From) => To
): Operator<Maybe<From>, Maybe<From | To>> {
  return maybe => (isSome(maybe) ? Some(mapper(maybe.value)) : maybe);
}

/**
 *  Error thrown for `take` operation
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
export const MAX_FLATTEN_DEPTH = 512;

/**
 * Turns a nested maybe into a maybe of depth 1. Input maybe should never exceed a depth of `MAX_FLATTEN_DEPTH`.
 * @template M type of the input maybe
 * @returns flattened maybe
 * @see {@link MAX_FLATTEN_DEPTH}
 */
export function flatten<M>(): Operator<Maybe<M>, Flatten<Maybe<M>>> {
  return maybe => {
    if (isNone(maybe)) return maybe as Flatten<Maybe<M>>;

    let inner = maybe.value;

    for (let i = 0; i < MAX_FLATTEN_DEPTH; i++) {
      if (!isMaybe(inner)) break;
      if (isNone(inner)) return inner as Flatten<Maybe<M>>;
      inner = inner.value;
    }

    return Some(inner) as Flatten<Maybe<M>>;
  };
}

// export const flatmap =
//   <M extends Maybe.Any, Output extends Maybe.Any = M>(
//     f: (someValue: SomeOf<M>) => Output
//   ): Operator<M, Output> =>
//   (maybe: M): Output =>
//     isSome(maybe) ? f(maybe.value) : (None() as Output);
