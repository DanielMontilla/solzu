import {
  RecordKey,
  Result,
  isArray,
  isInt,
  isNotEmptyArray,
  isNumber,
} from "../..";

/**
 * Generates a random floating-point number between 0 (inclusive) and 1 (exclusive).
 * @returns {number} A random floating-point number.
 */
export function nextFloat(): number {
  return Math.random();
}

export namespace nextFloat {
  export enum Error {
    InvalidRange,
    InvalidInput,
  }

  /**
   * Generates a random floating-point number between the specified minimum and maximum range.
   * Validates the range and input before generating the number.
   * @param {number} min - The minimum number in the range.
   * @param {number} max - The maximum number in the range.
   * @returns {Result<number, Error>} A Result containing the random number or an error.
   * @see `nextFloat.betweenU(...)` for unsafe but faster version
   */
  export function between(min: number, max: number): Result<number, Error> {
    return Result.Ok({ min, max })
      .checkOk(({ min }) => isNumber(min), Error.InvalidRange)
      .checkOk(({ max }) => isNumber(max), Error.InvalidRange)
      .checkOk(({ min, max }) => min <= max, Error.InvalidRange)
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
}

/**
 * @overload
 * Generates a random integer between and 0 and 1.
 * @returns {number} A random integer, which will always be 1 when no upper bound is provided.
 */
export function nextInt(): number;

/**
 * @overload
 * Generates a random integer between 1 (inclusive) and the specified upper bound (inclusive).
 * @param {number} upperBound - The upper bound for the random number generation.
 * @returns {number} A random integer between 1 and upperBound (inclusive).
 */
export function nextInt(upperBound: number): number;

export function nextInt(upperBound: number = 1): number {
  return Math.floor(Math.random() * (upperBound + 1));
}

export namespace nextInt {
  export enum BetweenError {
    InvalidRange,
    InvalidInput,
  }

  /**
   * Generates a random integer between the specified minimum and maximum range (inclusive).
   * Validates the range and input before generating the number.
   * @param {number} min - The minimum number in the range (inclusive).
   * @param {number} max - The maximum number in the range (inclusive).
   * @returns {Result<number, BetweenError>} A Result containing the random integer or an error.
   */
  export function between(
    min: number,
    max: number
  ): Result<number, BetweenError> {
    return Result.Ok({ min, max })
      .checkOk(({ min }) => isInt(min), BetweenError.InvalidInput)
      .checkOk(({ max }) => isInt(max), BetweenError.InvalidInput)
      .checkOk(({ min, max }) => min <= max, BetweenError.InvalidRange)
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
}

export function nextIndex(
  array: Array<unknown>
): Result<number, nextIndex.Error> {
  return Result.Ok(array)
    .checkOk(isNotEmptyArray, nextIndex.Error.EmptyArray)
    .mapOk(nextIndexU);
}

export function nextIndexU(array: Array<unknown>): number {
  return nextInt(array.length) - 1;
}

export namespace nextIndex {
  export enum Error {
    EmptyArray,
  }
}

// export function nextKey<K extends RecordKey>(
//   record: Record<K, unknown>
// ): Result<K, nextKey.RecordError>;
// export function nextKey<K>(map: Map<K, unknown>): Result<K, nextKey.MapError>;
// export function nextKey<K>(set: Set<K>): Result<K, nextKey.SetError>;
// export function nextKey(
//   array: Array<unknown>
// ): Result<number, nextKey.ArrayError>;
// export function nextKey<K>(
//   collection: K extends RecordKey
//     ? Record<K, unknown> | Map<K, unknown> | Set<K>
//     : Map<K, unknown> | Set<K> | Array<unknown>
// ): Result<K, nextKey.Error> {
//   const t = Result.Ok(collection).assertOk(isArray).mapOk(nextIndex);
// }

// export namespace nextKey {
//   export type Error = RecordError | MapError | SetError | ArrayError;
//   export enum RecordError {
//     EmptyRecord,
//   }
//   export enum MapError {
//     EmptyMap,
//   }
//   export enum SetError {
//     EmptySet,
//   }
//   export enum ArrayError {
//     EmptyArray,
//   }
// }

// export function nextElement() {}

// export namespace nextElement {}
