import { Nothing } from "..";
import { $CLASSIFIER, $SPECIFIER } from "../data";

/**
 * @internal
 * @description unique classifier for `Some` type
 */
export const SOME_CLASSIFIER = Symbol("solzu:core@some");

/**
 * @internal
 * @description unique specifier discriminator for `Some` type
 */
export const SOME_SPECIFIER = "some" as const;

/**
 * @internal
 * @description unique classifier for `None` type
 */
export const NONE_CLASSIFIER = Symbol("solzu:core@none");

/**
 * @internal
 * @description unique specifier discriminator for `None` type
 */
export const NONE_SPECIFIER = "none" as const;

/**
 * @description represents the presence of a value
 * @template V type of inner value
 */
export type Some<V> = {
  readonly [$SPECIFIER]: "some";
  readonly [$CLASSIFIER]: typeof SOME_CLASSIFIER;
  readonly value: V;
};

/**
 * @description represents the absence  of a value
 */
export type None = {
  readonly [$SPECIFIER]: "none";
  readonly [$CLASSIFIER]: typeof NONE_CLASSIFIER;
};

/**
 * @description either `Some<V>` or `None`
 * @template V type of some's inner value
 */
export type Maybe<V> = Some<V> | None;

export namespace Maybe {
  /**
   * @description generic maybe type. Extends `any` other maybe
   */
  export type Any = Maybe<any>;

  /**
   * @template M generic maybe
   * @returns inner some value
   */
  export type SomeOf<M extends Any> = M extends Some<infer V> ? V : never;

  /**
   * @description flattens nested maybes of any depth
   * @returns {Maybe<V>} single maybe type
   */
  export type Flatten<M extends Any> =
    M extends Maybe<infer O> ?
      O extends Any ?
        Flatten<O>
      : M
    : never;
}

/**
 * @description shorthand for promise of maybe
 * @template V inner `Some` type
 * @returns {Promise<Maybe<V>>}
 */
export type Future<V> = Promise<Maybe<V>>;

/**
 * @description re-export of `Maybe.SomeOf`
 * @see {@link Maybe.SomeOf}
 * @template M generic maybe
 * @returns inner some value
 */
export type SomeOf<M extends Maybe.Any> = Maybe.SomeOf<M>;

/**
 * @constructor
 * @returns {Some<None>} empty some
 */
export function Some(): Some<Nothing>;

/**
 * @constructor
 * @param {V} value
 * @template V inner value type
 * @returns {Some<V>} some with inner `value`
 */
export function Some<V>(value: V): Some<V>;

/**
 * @internal
 */
export function Some<V>(value?: V): Some<V> | Some<Nothing> {
  return {
    [$SPECIFIER]: SOME_SPECIFIER,
    [$CLASSIFIER]: SOME_CLASSIFIER,
    value: value !== undefined ? value : Nothing(),
  } as Some<V> | Some<Nothing>;
}

/**
 * @internal
 */
let _none: undefined | None;

/**
 * @constructor
 * @returns {None} none
 */
export function None(): None {
  return _none !== undefined ? _none : (
      (_none = { [$SPECIFIER]: NONE_SPECIFIER, [$CLASSIFIER]: NONE_CLASSIFIER })
    );
}

/**
 * @constructor
 * @template V inner `some` type
 * @returns {Maybe<V>} maybe. At runtime this will be a `None`
 */
export function Maybe<V>(): Maybe<V>;

/**
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
 * @template V inner `some` type
 * @param {Maybe<V>} maybe maybe to be checked
 * @returns {boolean} `true` if `Some`. Otherwise `false`
 */
export function isSome<V>(maybe: Maybe<V>): maybe is Some<V> {
  return maybe.kind === "some";
}

/**
 * @template V inner `some` type
 * @param {Maybe<V>} maybe maybe to be checked
 * @returns {boolean} `true` if `None`. Otherwise `false`
 */
export function isNone<V>(maybe: Maybe<V>): maybe is None {
  return maybe.kind === "none";
}

/**
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
