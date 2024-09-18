import { Decrement, Nothing } from "..";

/**
 * Represents the presence of a value
 * @template V type of inner value
 */
export type Some<V> = {
  readonly some: true;
  readonly value: V;
};

/**
 * Represents the absence of a value
 */
export type None = {
  readonly some: false;
};

/**
 * Either `Some<V>` or `None`
 * @template V type of some's inner value
 */
export type Maybe<V> = Some<V> | None;

/**
 * @internal
 */
export const MAYBE_MAX_UNFOLD_DEPTH = 512;

export namespace Maybe {
  /**
   * Generic `Maybe` type. Extends `any` other maybe
   */
  export type Any = Maybe<any>;

  /**
   * Extracts the inner `Some` value type
   * @template M input `Maybe` type
   * @returns inner `Some` value type
   */
  export type SomeOf<M extends Any> = M extends Some<infer V> ? V : never;

  /**
   * Unwraps nested `Maybe` type once
   * @template Root input `Maybe` type to flatten
   * @returns `Maybe` flattened once
   */
  export type Flatten<Root extends Any> = [Root] extends [Maybe<infer RootSome>]
    ? [RootSome] extends [Maybe<infer NestedSome>]
      ? Maybe<NestedSome>
      : Root
    : never;

  /**
   * Recursively unwraps nested `Maybe` type **infinitely**. Not recommended for general use. Use simpler versions like `Flatten` or `Unfold`
   * @template Root `Maybe` type to unfold
   * @returns `Maybe` of depth 1
   * @see {@link Maybe.Flatten}
   * @see {@link Maybe.Unfold}
   */
  export type InfiniteUnfold<Root extends Any> = [Root] extends [Maybe<infer RootSome>]
    ? [RootSome] extends [Maybe<infer NestedSome>]
      ? InfiniteUnfold<Maybe<NestedSome>>
      : Root
    : never;

  /**
   * Recursively unwraps nested `Maybe` type up to `Limit`. For an **infinite** version checkout `Maybe.InfiniteUnfold` or simpler `Result.Flatten`
   * @template Root `Maybe` type to unfold
   * @template Limit maximun depth for unesting. Default `512`
   * @returns `Maybe` of depth 1 if depth ≤ `Limit`. Otherwise the unfolded result up to `Limit`
   * @see {@link Result.InfiniteUnfold}
   * @see {@link Result.Flatten}
   */
  export type Unfold<
    Root extends Any,
    Limit extends number = typeof MAYBE_MAX_UNFOLD_DEPTH,
  > = Limit extends 0
    ? Root
    : [Root] extends [Maybe<infer RootSome>]
      ? [RootSome] extends [Any]
        ? Unfold<RootSome, Decrement<Limit>>
        : Root
      : never;
}

/**
 * Shorthand for `Promise` of a `Maybe`
 * @template V inner `Some` value type
 * @returns {Promise<Maybe<V>>}
 */
export type Future<V> = Promise<Maybe<V>>;

/**
 * Alias for `Maybe.SomeOf`
 * @template M input `Maybe` type
 * @returns inner `Some` value type
 * @see {@link Maybe.SomeOf}
 */
export type SomeOf<M extends Maybe.Any> = Maybe.SomeOf<M>;

/**
 * Creates empty `Some`
 * @constructor
 * @returns {Some<None>} empty `Some`
 */
export function Some(): Some<Nothing>;

/**
 * Creates `Some` w/ inner `value`
 * @constructor
 * @template V inner `value` type
 * @param {V} value
 * @returns {Some<V>} `Some` with inner `value`
 */
export function Some<V>(value: V): Some<V>;

/**
 * @internal
 */
export function Some<V>(value?: V): Some<V> | Some<Nothing> {
  return {
    some: true,
    value: value !== undefined ? value : Nothing(),
  } as Some<V> | Some<Nothing>;
}

/**
 * @internal
 */
let _none: undefined | None;

/**
 * Creates `None`
 * @constructor
 * @returns {None} `None`
 */
export function None(): None {
  return _none !== undefined ? _none : (_none = { some: false });
}

/**
 * Creates `None`, with type of `Maybe<V>`
 * @constructor
 * @template V inner `some` type
 * @returns {Maybe<V>} maybe. At runtime this will be a `None`
 */
export function Maybe<V>(): Maybe<V>;

/**
 * Creates `Some<V>` with type of `Maybe<V>`
 * @template V inner `some` type
 * @param {V} value inner `some` value
 * @returns {Maybe<V>} maybe. At runtime this will be a `Some<V>`
 */
export function Maybe<V>(value: V): Maybe<V>;

/**
 * @internal
 */
export function Maybe<V>(value?: V): Maybe<V> {
  return value === undefined ? None() : Some(value);
}

/**
 * Converts nullish value into `Maybe`
 * @constructor
 * @template V value
 * @param {V} value
 * @returns {Maybe<Exclude<V, null | undefined>>} `Some` if `value` in non nullish. `None` otherwise
 */
export function MaybeFromNullish<V>(value: V): Maybe<Exclude<V, null | undefined>> {
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
export async function MaybeFromPromise<V>(promise: Promise<V>): Future<V> {
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
export function MaybeFromTryCatch<V>(f: () => V): Maybe<V> {
  try {
    return Some(f());
  } catch (_) {
    return None();
  }
}

/**
 * Checks if provided `Maybe` is of type `Some`
 * @template V inner `Some` type
 * @param {Maybe<V>} maybe to be checked
 * @returns {boolean} `true` if `Some`. Otherwise `false`
 */
export function isSome<V>(maybe: Maybe<V>): maybe is Some<V>;

/**
 * Checks if thing is `Some`
 * @param {unknown} thing to be checked
 * @returns {boolean} `true` if `Some`. Otherwise `false`
 */
export function isSome(thing: unknown): thing is Some<unknown>;

/**
 * @internal
 */
export function isSome<V>(maybeOrThing: Maybe<V> | unknown): maybeOrThing is Some<V> {
  if (typeof maybeOrThing !== "object") return false;
  if (maybeOrThing === null) return false;
  if (Object.keys(maybeOrThing).length !== 2) return false;
  if (
    !("some" in maybeOrThing && typeof maybeOrThing.some === "boolean") ||
    !("value" in maybeOrThing)
  )
    return false;

  return maybeOrThing.some;
}

/**
 * Alias for `isSome`
 * @template V inner `Some` type
 * @param {Maybe<V>} maybe maybe to be checked
 * @returns {boolean} `true` if `Some`. Otherwise `false`
 * @see {@link isSome}
 */
export const notNone = isSome;

/**
 * Checks if provided `Maybe` is of type `None`
 * @template V inner `Some` type
 * @param {Maybe<V>} maybe maybe to be checked
 * @returns {boolean} `true` if `None`. Otherwise `false`
 */
export function isNone<V>(maybe: Maybe<V>): maybe is None;

/**
 * Checks if thing is `None`
 * @param {unknown} thing maybe to be checked
 * @returns {boolean} `true` if `None`. Otherwise `false`
 */
export function isNone(thing: unknown): thing is None;

/**
 * @internal
 */
export function isNone<V>(maybeOrThing: Maybe<V> | unknown): maybeOrThing is None {
  if (typeof maybeOrThing !== "object") return false;
  if (maybeOrThing === null) return false;
  if (Object.keys(maybeOrThing).length !== 1) return false;
  if (!("some" in maybeOrThing && typeof maybeOrThing.some === "boolean")) return false;
  return !maybeOrThing.some;
}

/**
 * Alais for `isNone`
 * @template V inner `Some` type
 * @param {Maybe<V>} maybe maybe to be checked
 * @returns {boolean} `true` if `None`. Otherwise `false`
 * @see {@link isNone}
 */
export const notSome = isNone;

/**
 * Checks if thing is of type `Maybe`
 * @param {unknown} thing data to be checked
 * @returns {boolean} `true` if thing is `Maybe`. Otherwise `false`
 */
export function isMaybe(thing: unknown): thing is Maybe.Any {
  return isSome(thing) || isNone(thing);
}
