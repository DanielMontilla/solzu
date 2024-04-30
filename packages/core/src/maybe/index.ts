import { Nothing } from "..";
import { $CLASSIFIER, $SPECIFIER } from "../data";

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

export namespace Maybe {
  /**
   * Generic `Maybe` type. Extends `any` other maybe
   */
  export type Any = Maybe<any>;

  /**
   * Extracts the inner `Some` type
   * @template M any `Maybe`
   * @returns inner `Some` type
   */
  export type SomeOf<M extends Any> = M extends Some<infer V> ? V : never;

  /**
   * Flattens nested maybes of any depth
   * @returns {Maybe<V>} `Maybe` of depth 1
   */
  export type Flatten<M extends Any> =
    M extends Maybe<infer V> ?
      V extends Any ?
        Flatten<V>
      : M
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
 * @template M any `Maybe`
 * @returns inner `Some` type
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
 * @template V inner `some` type
 * @param {unknown} thing value to be checked
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
