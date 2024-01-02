import {
  RecordKey,
  Result,
  isArray,
  isInt,
  isNotEmptyArray,
  isNumber,
  isMap,
  isRecord,
  keysOf,
  isSet,
} from "../..";

// can't find definition if imported from "../.." ¯\_(ツ)_/¯
import { defineEnum } from "../macros";

/**
 * Generates a random floating-point number between 0 (inclusive) and 1 (exclusive).
 * @returns {number} A random floating-point number.
 */
export function nextFloat(): number {
  return Math.random();
}

export namespace nextFloat {
  /**
   * Generates a random floating-point number between the specified minimum and maximum range.
   * Validates the range and input before generating the number.
   * @param {number} min - The minimum number in the range.
   * @param {number} max - The maximum number in the range.
   * @returns {Result<number, Error>} A Result containing the random number or an error.
   * @see `nextFloat.betweenU(...)` for unsafe but faster version
   */
  export function between(
    min: number,
    max: number
  ): Result<number, between.Error> {
    return Result.Ok({ min, max })
      .checkOk(({ min }) => isNumber(min), between.error.InvalidInput)
      .checkOk(({ max }) => isNumber(max), between.error.InvalidInput)
      .checkOk(({ min, max }) => min <= max, between.error.InvalidRange)
      .mapOk(({ min, max }) => betweenU(min, max));
  }

  /**
   * Generates a random floating-point number between the specified minimum and maximum range without validation.
   * This function expects the inputs are valid numbers with `min <= max`. Otherwise might behave in unexpected ways.
   * @param {number} min - The minimum number in the range.
   * @param {number} max - The maximum number in the range.
   * @returns {number} A random floating-point number between min and max.
   */
  export function betweenU(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  export namespace between {
    export type Error = (typeof error)[keyof typeof error];
    export const error = defineEnum(
      ["InvalidRange", "InvalidInput"] as const,
      "nextFloat@between"
    );
  }
}

/**
 * Generates a random integer between and 0 and 1.
 * @returns {number} A random integer, which will always be 1 when no upper bound is provided.
 */
export function nextInt(): number;

/**
 * Generates a random integer between 0 (inclusive) and the specified upper bound (inclusive).
 * @param {number} upperBound - The upper bound for the random number generation.
 * @returns {number} A random integer between 0 and upperBound (inclusive).
 */
export function nextInt(upperBound: number): number;

/**
 * Generates a random integer between 0 (inclusive) and a specified upper bound (inclusive).
 * If no upper bound is provided, it defaults to 1, effectively returning a random integer between 0 and 1.
 *
 * @param {number} [upperBound=1] - The upper bound for the random number generation. Defaults to 1.
 * @returns {number} A random integer between 0 and the specified upper bound (inclusive).
 */
export function nextInt(upperBound: number = 1): number {
  return Math.floor(Math.random() * (upperBound + 1));
}

export namespace nextInt {
  /**
   * Generates a random integer between the specified minimum and maximum range (inclusive).
   * Validates the range and input before generating the number.
   * @param {number} min - The minimum number in the range (inclusive).
   * @param {number} max - The maximum number in the range (inclusive).
   * @returns {Result<number, between.BetweenError>} A Result containing the random integer or an error.
   */
  export function between(
    min: number,
    max: number
  ): Result<number, between.Error> {
    return Result.Ok({ min, max })
      .checkOk(({ min }) => isInt(min), between.error.InvalidInput)
      .checkOk(({ max }) => isInt(max), between.error.InvalidInput)
      .checkOk(({ min, max }) => min <= max, between.error.InvalidRange)
      .mapOk(({ min, max }) => betweenU(min, max));
  }

  /**
   * Generates a random integer between the specified minimum and maximum range (inclusive) without validation.
   * This function expects the inputs are valid numbers with `min <= max`. Otherwise might behave in unexpected ways.
   * @param {number} min - The minimum number in the range (inclusive).
   * @param {number} max - The maximum number in the range (inclusive).
   * @returns {number} A random integer between min and max (inclusive).
   */
  export function betweenU(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  export namespace between {
    export type Error = (typeof error)[keyof typeof error];
    export const error = defineEnum(
      ["InvalidRange", "InvalidInput"] as const,
      "nextInt@between"
    );
  }
}

/**
 * Returns a random index of the given array with a flat distribution.
 * If the array is empty, it returns an error.
 *
 * @param array The array to get a random index from.
 * @returns `Result<number, nextIndex.Error>` contains index in it `Ok` variant, whilts `nextIndex.Error` in the `Err` case
 */
export function nextIndex(array: Array<any>): Result<number, nextIndex.Error> {
  return Result.Ok(array)
    .checkOk<nextIndex.Error>(isNotEmptyArray, nextIndex.error.EmptyArray)
    .mapOk(nextIndexU);
}

/**
 * Generates a random index for a given non-empty array with a flat distribution.
 * Assumes the array is not empty.
 *
 * @param array The non-empty array to calculate a random index for.
 * @returns `number` A randomly picked index of the array.
 */
export function nextIndexU(array: Array<any>): number {
  return nextInt(array.length - 1);
}

export namespace nextIndex {
  export type Error = (typeof error)[keyof typeof error];
  export const error = defineEnum(["EmptyArray"] as const, "nextIndex");
}

export function nextKey(
  array: Array<any>
): Result<number, nextKey.ofArray.Error>;

export function nextKey<K extends RecordKey>(
  record: Record<K, any>
): Result<K, nextKey.ofRecord.Error>;

export function nextKey<K>(map: Map<K, any>): Result<K, nextKey.ofMap.Error>;

export function nextKey<K>(set: Set<K>): Result<K, nextKey.ofSet.Error>;

export function nextKey<K>(
  collection: K extends RecordKey
    ? Record<K, any> | Map<K, any> | Set<K>
    : Map<K, any> | Set<K> | Array<any>
):
  | Result<number, nextKey.ofArray.Error>
  | Result<K, nextKey.ofRecord.Error>
  | Result<K, nextKey.ofMap.Error>
  | Result<K, nextKey.ofSet.Error> {
  const original = Result.Ok<nextKey.Collection>(collection);

  const forArray = () =>
    original.mapOk(arr => nextKey.ofArray(arr as Array<any>)).unfold();

  const forRecord = () =>
    original.mapOk(rec => nextKey.ofRecord(rec as Record<any, any>)).unfold();

  const forMap = () =>
    original.mapOk(map => nextKey.ofMap(map as Map<any, any>)).unfold();

  const forSet = () =>
    original.mapOk(set => nextKey.ofSet(set as Set<any>)).unfold();

  return forArray()
    .orIf(e => e === nextKey.ofArray.error.NotAnArray, forRecord)
    .orIf(e => e === nextKey.ofRecord.error.NotARecord, forMap)
    .orIf(e => e === nextKey.ofMap.error.NotAMap, forSet);
}

export namespace nextKey {
  export type Error =
    | ofRecord.Error
    | ofArray.Error
    | ofMap.Error
    | ofSet.Error;

  export type Collection =
    | Record<any, any>
    | Map<any, any>
    | Set<any>
    | Array<any>;

  /**
   * Attempts to select a random key from a record.
   * @param {Record<K, any>} record - The record to select a random key from.
   * @returns {Result<K, ofRecord.Error>} A `Result` of the random key or an error if the record is not valid or empty.
   */
  export function ofRecord<K extends RecordKey>(
    record: Record<K, any>
  ): Result<K, ofRecord.Error> {
    return Result.Ok(record)
      .assertOk(isRecord, ofRecord.error.NotARecord)
      .mapOk(keysOf)
      .mapOk(keys => nextIndex(keys).mapOk(i => ({ keys, i })))
      .unfold()
      .mapErr(err =>
        err === nextIndex.error.EmptyArray ? ofRecord.error.IsEmpty : err
      )
      .mapOk(({ keys, i }) => keys[i] as K);
  }

  export namespace ofRecord {
    export type Error = (typeof error)[keyof typeof error];
    export const error = defineEnum(
      ["NotARecord", "IsEmpty"] as const,
      "nextKey@ofRecord"
    );
  }

  /**
   * Attempts to select a random index from an array.
   * @param {Array<any>} array - The array to select a random index from.
   * @returns {Result<number, ofArray.Error>} A `Result` of the random index or an error if the array is not valid or empty.
   */
  export function ofArray(array: Array<any>): Result<number, ofArray.Error> {
    return Result.Ok(array)
      .assertOk(isArray, ofArray.error.NotAnArray)
      .mapOk(nextIndex)
      .unfold()
      .mapErr(err =>
        err === nextIndex.error.EmptyArray ? ofArray.error.IsEmpty : err
      );
  }

  export namespace ofArray {
    export type Error = (typeof error)[keyof typeof error];
    export const error = defineEnum(
      ["NotAnArray", "IsEmpty"] as const,
      "nextKey@ofArray"
    );
  }

  /**
   * Attempts to pick a random key from a map.
   * @param {Map<K, any>} map - The map to select a random key from.
   * @returns {Result<K, ofMap.Error>} A `Result` of the random key or an error if the map is not valid or empty.
   */
  export function ofMap<K>(map: Map<K, any>): Result<K, ofMap.Error> {
    return Result.Ok<Map<any, any>>(map)
      .assertOk(isMap, ofMap.error.NotAMap)
      .mapOk(map => [...map.keys()])
      .mapOk(keys => nextIndex(keys).mapOk(i => ({ keys, i })))
      .unfold()
      .mapErr(err =>
        err === nextIndex.error.EmptyArray ? ofMap.error.IsEmpty : err
      )
      .mapOk(({ keys, i }) => keys[i] as K);
  }

  export namespace ofMap {
    export type Error = (typeof error)[keyof typeof error];
    export const error = defineEnum(
      ["NotAMap", "IsEmpty"] as const,
      "nextKey@ofMap"
    );
  }

  /**
   * Attempts to select a random element from a set.
   * @param {Set<K>} set - The set to select a random element from.
   * @returns {Result<K, ofSet.Error>} A `Result` of the random element or an error if the set is not valid or empty.
   */
  export function ofSet<K>(set: Set<K>): Result<K, ofSet.Error> {
    return Result.Ok<Set<any>>(set)
      .assertOk(isSet, ofSet.error.NotASet)
      .mapOk(set => [...set.keys()])
      .mapOk(keys => nextIndex(keys).mapOk(i => ({ keys, i })))
      .unfold()
      .mapErr(err =>
        err === nextIndex.error.EmptyArray ? ofSet.error.IsEmpty : err
      )
      .mapOk(({ keys, i }) => keys[i] as K);
  }
  export namespace ofSet {
    export type Error = (typeof error)[keyof typeof error];
    export const error = defineEnum(
      ["NotASet", "IsEmpty"] as const,
      "nextKey@ofSet"
    );
  }
}
