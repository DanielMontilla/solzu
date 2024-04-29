import { $CLASSIFIER, $SPECIFIER } from "../data";

/**
 * @internal
 * @description unique classifier for `Nothing` type
 */
export const NOTHING_CLASSIFIER = Symbol("solzu:core@nothing");

/**
 * @internal
 * @description unique kind discriminator for `Nothing` type
 */
export const NOTHING_SPECIFIER = "nothing" as const;

/**
 * @description explicit empty type
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
 * @returns {Nothing} nothing value
 */
export const Nothing = (): Nothing =>
  _nothing !== undefined ? _nothing : (
    (_nothing = { kind: NOTHING_SPECIFIER, [$CLASSIFIER]: NOTHING_CLASSIFIER })
  );

/**
 *
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
