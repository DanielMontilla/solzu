import { $CLASSIFIER, $SPECIFIER } from "../../data";

/**
 * Unique classifier for `Nothing` type
 * @internal
 */
export const NOTHING_CLASSIFIER = Symbol("solzu:core@nothing");

/**
 * Unique kind discriminator for `Nothing` type
 * @internal
 */
export const NOTHING_SPECIFIER = "nothing" as const;

/**
 * Explicit empty type
 */
export type Nothing = {
  readonly [$SPECIFIER]: "nothing";
  readonly [$CLASSIFIER]: typeof NOTHING_CLASSIFIER;
};

/**
 * @internal
 */
let _nothing: undefined | Nothing;

/**
 * @constructor
 * @returns {Nothing} nothing instance
 */
export const Nothing = (): Nothing =>
  _nothing !== undefined ? _nothing : (
    (_nothing = { kind: NOTHING_SPECIFIER, [$CLASSIFIER]: NOTHING_CLASSIFIER })
  );

/**
 * Checks if thing is instance of `Nothing`
 * @param {unknown} thing value to be checked
 * @returns {boolean} `true` thins is `Nothing`. Otherwise `false`
 */
export function isNothing(thing: unknown): thing is Nothing {
  return (
    typeof thing == "object" &&
    thing !== null &&
    Object.values(thing).length === 2 &&
    $CLASSIFIER in thing &&
    thing[$CLASSIFIER] === NOTHING_CLASSIFIER &&
    $SPECIFIER in thing &&
    thing[$SPECIFIER] === NOTHING_SPECIFIER
  );
}
