import { Either, Mapper } from "..";

type Empty = void;

/**
 * Represents a value that might be a successful result (`Ok`) or an error (`Err`).
 * It's a way to handle errors or success without throwing exceptions.
 * @template V - The type of the value for successful results.
 * @template E - The type of the error for failed results.
 */
export abstract class Result<V = Empty, E = Empty> {
  /**
   * Extracts the `Ok` value directly.
   * @throws If the `Result` is `Err`.
   * @returns The `Ok` value.
   */
  abstract takeOk(): V;

  /**
   * Extracts the `Err` value directly.
   * @throws If the `Result` is `Ok`.
   * @returns The `Err` value.
   */
  abstract takeErr(): E;

  /**
   * Checks if the `Result` is `Ok`.
   * @returns `true` if `Result` is `Ok`, otherwise `false`.
   */
  abstract isOk(): this is Ok<V>;

  /**
   * Checks if the `Result` is `Err`.
   * @returns `true` if `Result` is `Err`, otherwise `false`.
   */
  abstract isErr(): this is Err<E>;

  /**
   * Performs a side effect when `Result` is `Ok`.
   * @param fn - The function to execute if `Result` is `Ok`.
   * @returns The original `Result` for chaining.
   */
  abstract onOk(fn: (value: V) => any): Result<V, E>;

  /**
   * Performs a side effect when `Result` is `Err`.
   * @param fn - The function to execute if `Result` is `Err`.
   * @returns The original `Result` for chaining.
   */
  abstract onErr(fn: (error: E) => any): Result<V, E>;

  /**
   * Converts `Result` to `Either` type.
   * @returns An `Either` representation of the `Result`.
   */
  abstract toEither(): Either<V, E>;

  /**
   * Creates an `Ok` result.
   * @template V - The type of the value.
   * @param {V | void} value - The value to wrap in an `Ok` result.
   * @returns {Ok<V>} An `Ok` result containing the value.
   */
  public static Ok<V>(value: V): Ok<V>;
  public static Ok(value: void): Ok<Empty>;
  public static Ok<V>(value: V): Ok<V> {
    return new Ok(value);
  }

  /**
   * Creates an `Err` result.
   * @template E - The type of the error.
   * @param {E | void} error - The error to wrap in an `Err` result.
   * @returns {Err<E>} An `Err` result containing the error.
   */
  public static Err<E>(error: E): Err<E>;
  public static Err(error: void): Err<Empty>;
  public static Err<E>(error: E): Err<E> {
    return new Err(error);
  }

  /**
   * Wraps a value in an `Ok` result. Unlike `Result.Ok` its type is of `Result` and not `Ok`. `Result.Ok` is recommended.
   * @template V - The type of the value.
   * @param {V | void} value - The value to wrap.
   * @returns {Result<V, unknown>} A result that is `Ok` with the given value.
   */
  public static OfOk(value: void): Result<Empty, unknown>;
  public static OfOk<V, E = unknown>(value: V): Result<V, E> {
    return new Ok(value);
  }

  /**
   * Wraps an error in an `Err` result. Unlike `Result.Err` its type is of `Result` and not `Err`. `Result.Err` is recommended.
   * @template E - The type of the error.
   * @param {E | void} error - The error to wrap.
   * @returns {Result<unknown, E>} A result that is `Err` with the given error.
   */
  public static OfErr(error: void): Result<unknown, Empty>;
  public static OfErr<E>(error: E): Result<unknown, E> {
    return new Err(error);
  }

  /**
   * Creates a `Result` from a promise, optionally transforming the error.
   * This function provides a way to handle asynchronous operations and their outcomes,
   * encapsulating them in a `Result` type that represents either success (`Ok`) or failure (`Err`).
   *
   * @template V - The type of the resolved value of the promise.
   * @template E - The type of the error after being transformed by the mapper.
   * @param {Promise<V>} promise - The promise to convert into a result.
   * @param {Mapper<unknown, E>} [mapper] - Optional function to transform the caught error.
   * @returns {Promise<Result<V, E>> | Promise<Result<V, unknown>>} - A promise that resolves to a result.
   * `Ok` if the promise resolves, `Err` if it rejects. If an error mapper is provided and the promise rejects,
   * the error will be transformed by the mapper before being placed in `Err`.
   *
   * Overloads:
   * - Without mapper: Resolves to `Result<V, unknown>` where `V` is the resolved value of the promise.
   * - With mapper: Resolves to `Result<V, E>` where `E` is the type of the error after being transformed.
   *
   * Usage:
   * - When expecting the promise to resolve and want to handle the resolved value as `Ok`.
   * - When expecting the promise might reject and want to handle the rejection as `Err`.
   * - Optionally provide a mapper to transform the rejection error into a more suitable type or format.
   */
  public static async FromPromise<V>(
    promise: Promise<V>
  ): Promise<Result<V, unknown>>;
  public static async FromPromise<V, E>(
    promise: Promise<V>,
    mapper: Mapper<unknown, E>
  ): Promise<Result<V, E>>;
  public static async FromPromise<V, E>(
    promise: Promise<V>,
    mapper?: Mapper<unknown, E>
  ): Promise<Result<V, E> | Result<V, unknown>> {
    try {
      return new Ok(await promise);
    } catch (e) {
      const error = mapper ? mapper(e) : e;
      return new Err(error);
    }
  }

  /**
   * Attempts to execute a function and captures the result or error in a `Result` type.
   * This function provides a way to handle synchronous operations that might throw errors,
   * encapsulating them in a `Result` type that represents either success (`Ok`) or failure (`Err`).
   * An optional error mapper can transform the caught error into a desired format or type.
   *
   * @template V - The type of the returned value of the function.
   * @template E - The type of the error after being transformed by the mapper.
   * @param {() => V} fn - The function to execute.
   * @param {Mapper<unknown, E>} [mapper] - Optional function to transform the caught error.
   * @returns {Result<V, E> | Result<V, unknown>} - A result, `Ok` if the function returns successfully, `Err` if it throws.
   * The `Ok` variant contains the returned value, and the `Err` variant contains the caught error or its transformed version.
   *
   * Overloads:
   * - Without mapper: Resolves to `Result<V, unknown>` where `V` is the returned value of the function.
   * - With mapper: Resolves to `Result<V, E>` where `E` is the type of the error after being transformed.
   *
   * Usage:
   * - When you have a function that might throw and you want to handle the outcome explicitly as a `Result`.
   * - Optionally provide a mapper to transform the rejection error into a more suitable type or format.
   */
  public static FromTryCatch<V, E>(
    fn: () => V,
    mapper: Mapper<unknown, E>
  ): Result<V, E>;
  public static FromTryCatch<V>(fn: () => V): Result<V, unknown>;
  public static FromTryCatch<V, E>(
    fn: () => V,
    mapper?: Mapper<unknown, E>
  ): Result<V, unknown> | Result<V, E> {
    try {
      return Result.Ok(fn());
    } catch (e) {
      return new Err(mapper ? mapper(e) : e);
    }
  }
}

/**
 * Represents a successful result, containing a value.
 */
export class Ok<V> extends Result<V, never> {
  public constructor(private _value: V) {
    super();
  }

  public get value() {
    return this._value;
  }
  public takeOk(): V {
    return this.value;
  }
  public takeErr(): never {
    throw Error("Trying to takeErr on a `Ok` Result");
  }
  public isOk(): this is Ok<V> {
    return true;
  }
  public isErr(): this is Err<never> {
    return false;
  }
  public onErr(_: (errors: never) => any): Result<V, never> {
    return this;
  }
  public onOk(fn: (value: V) => any): Result<V, never> {
    fn(this.value);
    return this;
  }

  public toEither(): Either<V, never> {
    return Either.Left(this.value);
  }
}

/**
 * Represents a failed result, containing an error.
 */
export class Err<E> extends Result<never, E> {
  public constructor(private _error: E) {
    super();
  }

  public get error() {
    return this._error;
  }
  public takeOk(): never {
    throw Error("Trying to takeOk on an `Err` Result");
  }
  public takeErr(): E {
    return this.error;
  }
  public isOk(): this is Ok<never> {
    return false;
  }
  public isErr(): this is Err<E> {
    return true;
  }
  public onOk(_: (value: never) => any): Result<never, E> {
    return this;
  }
  public onErr(fn: (errors: E) => any): Result<never, E> {
    fn(this.error);
    return this;
  }

  public toEither(): Either<never, E> {
    return Either.Right(this._error);
  }
}
