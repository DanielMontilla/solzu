import { Nothing } from "..";
import { $CLASSIFIER, $SPECIFIER } from "../../data";
import { Decrement } from "../../types";
import { MAX_UNFOLD_DEPTH } from "./scoped";

/**
 * Unique classifier for `Some` type
 * @internal
 */
export const SOME_CLASSIFIER = Symbol("solzu:core@some");

/**
 * Unique specifier discriminator for `Some` type
 * @internal
 */
export const SOME_SPECIFIER = "some" as const;

/**
 * Unique classifier for `None` type
 * @internal
 */
export const NONE_CLASSIFIER = Symbol("solzu:core@none");

/**
 * Unique specifier discriminator for `None` type
 * @internal
 */
export const NONE_SPECIFIER = "none" as const;

/**
 * Represents the presence of a value
 * @template V type of inner value
 */
export type Some<V> = {
  readonly [$CLASSIFIER]: typeof SOME_CLASSIFIER;
  readonly [$SPECIFIER]: "some";
  readonly value: V;
};

/**
 * Represents the absence of a value
 */
export type None = {
  readonly [$CLASSIFIER]: typeof NONE_CLASSIFIER;
  readonly [$SPECIFIER]: "none";
};

/**
 * Either `Some<V>` or `None`
 * @template V type of some's inner value
 */
export type Maybe<V> = Some<V> | None;

export module Maybe {
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
  export type Flatten<Root extends Any> =
    [Root] extends [Maybe<infer RootSome>] ?
      [RootSome] extends [Maybe<infer NestedSome>] ?
        Maybe<NestedSome>
      : Root
    : never;

  /**
   * Recursively unwraps nested `Maybe` type **infinitely**. Not recommended for general use. Use simpler versions like `Flatten` or `Unfold`
   * @template Root `Maybe` type to unfold
   * @returns `Maybe` of depth 1
   * @see {@link Maybe.Flatten}
   * @see {@link Maybe.Unfold}
   */
  export type InfiniteUnfold<Root extends Any> =
    [Root] extends [Maybe<infer RootSome>] ?
      [RootSome] extends [Maybe<infer NestedSome>] ?
        InfiniteUnfold<Maybe<NestedSome>>
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
    Limit extends number = typeof MAX_UNFOLD_DEPTH,
  > =
    Limit extends 0 ? Root
    : [Root] extends [Maybe<infer RootSome>] ?
      [RootSome] extends [Any] ?
        Unfold<RootSome, Decrement<Limit>>
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
    [$CLASSIFIER]: SOME_CLASSIFIER,
    [$SPECIFIER]: SOME_SPECIFIER,
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
  return _none !== undefined ? _none : (
      (_none = { [$CLASSIFIER]: NONE_CLASSIFIER, [$SPECIFIER]: NONE_SPECIFIER })
    );
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
 * Checks if provided `Maybe` is of type `Some`
 * @template V inner `Some` type
 * @param {Maybe<V>} maybe maybe to be checked
 * @returns {boolean} `true` if `Some`. Otherwise `false`
 */
export function isSome<V>(maybe: Maybe<V>): maybe is Some<V> {
  return maybe.kind === "some";
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
export function isNone<V>(maybe: Maybe<V>): maybe is None {
  return maybe.kind === "none";
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
 * Checks if provided `thing` is of type `Maybe`
 * @param {unknown} thing data to be checked
 * @returns {boolean} `true` if thing is `Maybe`. Otherwise `false`
 */
export function isMaybe(thing: unknown): thing is Maybe.Any {
  return (
    typeof thing == "object" &&
    thing !== null &&
    $CLASSIFIER in thing &&
    (thing[$CLASSIFIER] === SOME_CLASSIFIER ||
      thing[$CLASSIFIER] === NONE_CLASSIFIER) &&
    $SPECIFIER in thing &&
    (thing[$SPECIFIER] === SOME_SPECIFIER ||
      thing[$SPECIFIER] === NONE_SPECIFIER)
  );
}
